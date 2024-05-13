import * as AWS from 'aws-sdk';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs-extra';
import * as path from 'path';

import { AddEngineerDataDto } from './dto/addengineerData.dto';
import { Constants } from 'src/utils/constants';
import { DocumentService } from 'src/document/document.service';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { Injectable } from '@nestjs/common';
import { JWT } from 'google-auth-library';
import { PrismaService } from 'src/prisma.service';
import { ROOT_DIR } from '../../rootDir';
import { Storage } from '@google-cloud/storage';
import { UpdateEngineerDataDto } from './dto/updateengineerData.dto';
import axios from 'axios';

// const storage = new Storage();
@Injectable()
export class ApplyAsEngineerService {
  private readonly storage: Storage;
  private doc: GoogleSpreadsheet;
  constructor(
    private prisma: PrismaService,
    private documentService: DocumentService
  ) {
  const filePath = path.resolve(ROOT_DIR,"eremote-hire-website-cloud.json");
  const creds = fs.readJsonSync(filePath);
    this.storage = new Storage({
      projectId: process.env.PROJECT_ID,
      keyFilename: process.env.KEYFILENAME,
    });
    const bucketName = process.env.CLOUD_BUCKET_NAME;
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });

    console.log(serviceAccountAuth, "service account auth")
    console.log(process.env.GOOGLE_SPREADSHEET_ID, "google spreadsheetid")
    this.doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID, serviceAccountAuth);
  }



 


  // ) {
  //   this.s3 = new AWS.S3({
  //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  //     region: process.env.AWS_BUCKET_REGION,
  //   });
  // }

  // async addEngineerData(
  //   addEngineerDataDto: AddEngineerDataDto,
  //   updateEngineerDataDto: UpdateEngineerDataDto,
  //   files: Express.Multer.File[],
  // ) {
  //   const addDocument = await this.documentService.addDocuments(files);

  //   const engineerData = await this.prisma.applyAsEngineer.create({
  //     data: {
  //       name: addEngineerDataDto.name,
  //       emailId: addEngineerDataDto.emailId,
  //       phoneNo: Number(addEngineerDataDto.phoneNo),
  //       linkedinUrl: addEngineerDataDto.linkedInUrl,
  //       resume: addDocument[0],
  //     },
  //   });

  //   const s3 = new AWS.S3();

  //   const fileExists = await this.checkIfFileExists(s3);
  //   let workbook: ExcelJS.Workbook;

  //   if (fileExists) {
  //     const existingFileBuffer = await this.downloadFileFromS3(s3);
  //     workbook = new ExcelJS.Workbook();
  //     await workbook.xlsx.load(existingFileBuffer);
  //   } else {
  //     workbook = new ExcelJS.Workbook();
  //     workbook.addWorksheet('applyAsEngineer');
  //   }
  //   const worksheet = workbook.getWorksheet('applyAsEngineer');
  //   if (!fileExists) {
  //     const headers = Object.keys(engineerData);
  //     worksheet.addRow(headers);
  //   }

  //   const rowData = Object.values(engineerData);
  //   worksheet.addRow(rowData);

  //   const buffer = await workbook.xlsx.writeBuffer();

  //   const uploadParams: AWS.S3.PutObjectRequest = {
  //     Bucket: Constants.bucketName,
  //     Key: 'applyAsEngineer.xlsx',
  //     Body: buffer,
  //     ContentType:
  //       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //   };

  //   await s3.upload(uploadParams).promise();

  //   return engineerData;
  // }


async addEngineerData(
  addEngineerDataDto: AddEngineerDataDto,
  updateEngineerDataDto: UpdateEngineerDataDto,
  files: Express.Multer.File[],
) {
  console.log("enter");

  console.log(this.doc, "doc");
  console.log(await this.doc.loadInfo(), "loadCells");

  try {
    console.log("Trying to load spreadsheet info...");
    const sheetData = await this.doc.loadInfo();
    console.log("Spreadsheet info loaded successfully:", sheetData);
    console.log("Spreadsheet title:", this.doc.title);
  } catch (error) {
    console.error("Error loading spreadsheet info:", error);
  }
  
  await this.doc.updateProperties({ title: "apply as engineer" });

  const sheet = this.doc.sheetsByIndex[0];  
  let headers:string[] = [];
  const bucketName = 'eremotehire'; 
  let fileName= "applyAsEngineerReport.xlsx"
  let workbook: ExcelJS.Workbook;
  const fileExists = await this.checkIfFileExists(bucketName, fileName);
  console.log(fileExists, "fileExists");
  if (fileExists) {
    const existingFile = await this.downloadFileFromGCS(bucketName, fileName);
    console.log(existingFile, "existingFile");
    workbook = new ExcelJS.Workbook();
    const loadedFile = await workbook.xlsx.load(existingFile);
    console.log(loadedFile, "loadedFile");
  } else {
    workbook = new ExcelJS.Workbook();
    const created = workbook.addWorksheet('applyAsEngineerReport.xlsx');
    console.log(created, "created");
  }

  const worksheet = workbook.getWorksheet('applyAsEngineerReport.xlsx');
  console.log(worksheet, "worksheet");
  
  // if (!fileExists) {
    headers = Object.keys(addEngineerDataDto);
    headers.push("resume");
    console.log("headers", headers);
    sheet.setHeaderRow(headers);
    
  // }


  const addDocument = await this.addDocuments(files);
  console.log(addDocument, "addDocument");
  const addDocumentShortUrl = await this.shortenUrl(addDocument);
  console.log(addEngineerDataDto.resume, "resume");
  addEngineerDataDto.resume = addDocumentShortUrl;
  let rowData = Object.values(addEngineerDataDto);
  console.log(rowData, "rowData"); 
  rowData = rowData.map((value, index) => {
    const header = headers[index];
    return header === "resume" ? addEngineerDataDto.resume : value;
  });
  console.log(rowData, "rowData");
  await sheet.addRow(rowData);
  rowData = rowData.map((value, index) => {
    console.log(index, "index");
    console.log(rowData.length, "rawData");
    console.log(rowData.length-1, "rawData");    
    if (index === rowData.length - 1) {
      return addEngineerDataDto.resume;
    }
    return value;
  });

  const data = worksheet.addRow(rowData);
  console.log(data, "data");
    
  // const buffer = await workbook.xlsx.writeBuffer();

  // const bucket = this.storage.bucket(bucketName);
  // const file = bucket.file(fileName);

  // console.log(file, "file");
  // const stream = file.createWriteStream({
  //   contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  // });

  // console.log(stream, "stream");
  // stream.on('error', (err) => {
  //   console.error('Error uploading file:', err);
  // });

  // stream.on('finish', async () => {
  //   console.log('File uploaded successfully');
  // });

  // stream.end(buffer);

  console.log(addDocument, "addDocument");
  const engineerData = await this.prisma.applyAsEngineer.create({
    data: {
      name: addEngineerDataDto.name,
      emailId: addEngineerDataDto.emailId,
      phoneNo: Number(addEngineerDataDto.phoneNo),
      linkedinUrl: addEngineerDataDto.linkedInUrl,
      resume: addDocumentShortUrl,
    },
  });

  return engineerData;
}


async shortenUrl(longUrl: string){
  const apiUrl = `https://is.gd/create.php?format=json&url=${encodeURIComponent(longUrl)}`;

  try {
    const response = await axios.get(apiUrl);
    return response.data.shorturl;
  } catch (error) {
    console.error('Error shortening URL:', error);
    return longUrl; // Return the original URL if an error occurs
  }
}
  // private async checkIfFileExists(s3: AWS.S3): Promise<boolean> {
  //   try {
  //     await s3
  //       .headObject({
  //         Bucket: Constants.bucketName,
  //         Key: 'applyAsEngineer.xlsx',
  //       })
  //       .promise();
  //     return true;
  //   } catch (error) {
  //     if (error.code === 'NotFound') {
  //       return false;
  //     }
  //     throw error;
  //   }
  // }

  // private async downloadFileFromS3(s3: AWS.S3): Promise<Buffer> {
  //   const params: AWS.S3.GetObjectRequest = {
  //     Bucket: Constants.bucketName,
  //     Key: 'applyAsEngineer.xlsx',
  //   };
  //   const response = await s3.getObject(params).promise();
  //   return response.Body as Buffer;
  // }

  private async checkIfFileExists(bucketName: string, fileName: string){
    const bucket = this.storage.bucket(bucketName);
    const file = bucket.file(fileName);
  
    return new Promise((resolve, reject) => {
      file.exists((err, exists) => {
        if (err) {
          reject(err);
        } else {
          resolve(exists);
        }
      });
    });
  }

private async downloadFileFromGCS(bucketName: string, fileName: string): Promise<Buffer> {
  const bucket = this.storage.bucket(bucketName);
  const file = bucket.file(fileName);

  return new Promise((resolve, reject) => {
    file.download((err, contents) => {
      if (err) {
        reject(err);
      } else {
        resolve(contents);
      }
    });
  });
}

  async getEngineerData(id: string) {
    if (id) {
      const engineerData = await this.prisma.applyAsEngineer.findUnique({
        where: {
          id,
        },
      });
      return engineerData;
    } else {
      const engineerData = await this.prisma.applyAsEngineer.findMany({});
      return engineerData;
    }
  }

  async deleteEngineerData(id: string) {
    if (id) {
      const engineerData = await this.prisma.applyAsEngineer.delete({
        where: {
          id,
        },
      });
      return engineerData;
    } else {
      const engineerData = await this.prisma.applyAsEngineer.deleteMany({});
      return engineerData;
    }
  }

  async addDocuments(
    files: Express.Multer.File[],
    userId?: string,
    foldername?: string,
  ) {
    if (userId) {
      const folderName = foldername;
      const documentsUrls = await this.uploadFilesToGCS(files, folderName);
  
      const Documents = await this.prisma.document.create({
        data: {
          userId: userId,
          document: documentsUrls,
        },
      });
      return Documents.document[0];
    } else {
      const folderName = `${Constants.applyAsEngineer}/${Constants.resume}`;
      const documentsUrls = await this.uploadFilesToGCS(files, folderName);
  
      const Documents = await this.prisma.document.create({
        data: {
          // userId: userId,
          document: documentsUrls,
        },
      });
      return Documents.document[0];
    }
  }
  
  async uploadFilesToGCS(files: Express.Multer.File[], folderName: string) {
    const bucketName = 'eremotehire'; 
    const bucket = this.storage.bucket(bucketName);
    const documentsUrls = [];
  
    await Promise.all(
      files.map(async (file) => {
        const destination = folderName ? `${folderName}/${file.originalname}` : file.originalname;
        const fileUpload = bucket.file(destination);
        await fileUpload.save(file.buffer);
        const [url] = await fileUpload.getSignedUrl({ action: 'read', expires: '03-09-2491' }); 
        documentsUrls.push(url);
      })
    );
  
    return documentsUrls;
  }
}
