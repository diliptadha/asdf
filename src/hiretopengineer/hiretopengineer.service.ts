import * as AWS from 'aws-sdk';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs-extra';
import * as path from 'path';

import { AddHireTopEngineerDto } from './dto/addhiretopengineer.dto';
import { Constants } from 'src/utils/constants';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { Injectable } from '@nestjs/common';
import { JWT } from 'google-auth-library';
import { PrismaService } from 'src/prisma.service';
import { ROOT_DIR } from 'rootDir';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class HiretopengineerService {
  private readonly storage: Storage;
  private readonly bucketName: string;
  private readonly doc: GoogleSpreadsheet;
  constructor(private prisma: PrismaService) {
    const filePath = path.resolve(ROOT_DIR, 'eremote-hire-website-cloud.json');
    const creds = fs.readJsonSync(filePath);
    this.storage = new Storage({
      projectId: process.env.PROJECT_ID,
      keyFilename: process.env.KEYFILENAME,
    });
    this.bucketName = process.env.CLOUD_BUCKET_NAME;
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.doc = new GoogleSpreadsheet(
      process.env.SPREADSHEET_ID,
      serviceAccountAuth,
    );
  }

  async addhireEngineerData(
    addHireTopEngineerDto: AddHireTopEngineerDto,
    userId?: string,
  ) {
    console.log('enter');

    console.log(this.doc, 'doc');
    try {
      const sheetData = await this.doc.loadInfo();
      console.log(sheetData, 'sheetdata');
    } catch (error) {
      console.error('Error loading sheet info:', error);
    } 
    console.log(this.doc.title);
    await this.doc.updateProperties({ title: 'Hire Top Engineer' });

    const sheet = this.doc.sheetsByIndex[0];
    let headers: string[] = [];
    const bucketName = 'eremotehire';
    let fileName = 'hireTopEngineerReport.xlsx';
    let workbook: ExcelJS.Workbook;
    const fileExists = await this.checkIfFileExists(bucketName, fileName);
    console.log(fileExists, 'fileExists');
    if (fileExists) {
      const existingFile = await this.downloadFileFromGCS(bucketName, fileName);
      console.log(existingFile, 'existingFile');
      workbook = new ExcelJS.Workbook();
      const loadedFile = await workbook.xlsx.load(existingFile);
      console.log(loadedFile, 'loadedFile');
    } else {
      workbook = new ExcelJS.Workbook();
      const created = workbook.addWorksheet('hireTopEngineerReport.xlsx');
      console.log(created, 'created');
    }

    const worksheet = workbook.getWorksheet('hireTopEngineerReport.xlsx');
    console.log(worksheet, 'worksheet');
    console.log(sheet, 'sheet');
    if (userId) {
      const hiredData = await this.prisma.hireTopEngineer.create({
        data: {
          userId: userId,
          workType: addHireTopEngineerDto.workType,
          skill: addHireTopEngineerDto?.skill || [],
          noOfSoftEngineer: addHireTopEngineerDto.noOfSoftEngineer,
          firstName: addHireTopEngineerDto.firstName,
          lastName: addHireTopEngineerDto.lastName,
          companyEmail: addHireTopEngineerDto.companyEmail,
          noOfEmployee: addHireTopEngineerDto.noOfEmployee,
          message: addHireTopEngineerDto.message
            ? addHireTopEngineerDto.message
            : 'null',
          findUs: addHireTopEngineerDto?.findUs || [],
        },
      });

      const skillData = Array.isArray(hiredData.skill)
        ? hiredData.skill.join(', ')
        : hiredData.skill || null;
      const findUsData = Array.isArray(hiredData.findUs)
        ? hiredData.findUs.join(', ')
        : hiredData.findUs || null;

      const modifiedDto = {
        userId: userId,
        workType: hiredData.workType,
        skill: skillData ? skillData : 'null',
        noOfSoftEngineer: hiredData.noOfSoftEngineer,
        firstName: hiredData.firstName,
        lastName: hiredData.lastName,
        companyEmail: hiredData.companyEmail,
        noOfEmployee: hiredData.noOfEmployee,
        message: hiredData.message ? hiredData.message : 'null',
        findUs: findUsData ? findUsData : 'null',
      };
      headers = Object.keys(modifiedDto);
      console.log(headers, "headers");
      const data = await sheet.setHeaderRow(headers)
      console.log(data);


      const rowData = Object.values(modifiedDto);
      await sheet.addRow(rowData);

      return hiredData;
    } else {
      const hiredData = await this.prisma.hireTopEngineer.create({
        data: {
          workType: addHireTopEngineerDto.workType,
          skill: addHireTopEngineerDto?.skill || [],
          noOfSoftEngineer: addHireTopEngineerDto.noOfSoftEngineer,
          firstName: addHireTopEngineerDto.firstName,
          lastName: addHireTopEngineerDto.lastName,
          companyEmail: addHireTopEngineerDto.companyEmail,
          noOfEmployee: addHireTopEngineerDto.noOfEmployee,
          message: addHireTopEngineerDto.message
            ? addHireTopEngineerDto.message
            : 'null',
          findUs: addHireTopEngineerDto?.findUs || [],
        },
      });

      const skillData = Array.isArray(hiredData.skill)
        ? hiredData.skill.join(', ')
        : hiredData.skill || null;
      const findUsData = Array.isArray(hiredData.findUs)
        ? hiredData.findUs.join(', ')
        : hiredData.findUs || null;

      const modifiedDto = {
        workType: hiredData.workType,
        skill: skillData ? skillData : 'null',
        noOfSoftEngineer: hiredData.noOfSoftEngineer,
        firstName: hiredData.firstName,
        lastName: hiredData.lastName,
        companyEmail: hiredData.companyEmail,
        noOfEmployee: hiredData.noOfEmployee,
        message: hiredData.message ? hiredData.message : 'null',
        findUs: findUsData ? findUsData : 'null',
      };

      const headers = Object.keys(modifiedDto);
      console.log(headers, 'headers');
      const setHeader = await sheet.setHeaderRow(headers);

      const rowData = Object.values(modifiedDto);
      const data = worksheet.addRow(rowData);
      console.log(data, 'data');

      // const buffer = await workbook.xlsx.writeBuffer();

      // const bucket = this.storage.bucket(bucketName);
      // const file = bucket.file(fileName);

      // console.log(file, 'file');
      // const stream = file.createWriteStream({
      //   contentType:
      //     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      // });

      // console.log(stream, 'stream');
      // stream.on('error', (err) => {
      //   console.error('Error uploading file:', err);
      // });

      // stream.on('finish', async () => {
      //   console.log('File uploaded successfully');
      // });

      // stream.end(buffer);

      console.log(rowData, 'rowData');
      await sheet.addRow(rowData);
      return hiredData;
    }
  }

  private async checkIfFileExists(bucketName: string, fileName: string) {
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

  private async downloadFileFromGCS(
    bucketName: string,
    fileName: string,
  ): Promise<Buffer> {
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

  async gethireEngineerData(id?: string) {
    if (id) {
      const hireData = await this.prisma.hireTopEngineer.findUnique({
        where: {
          id: id,
        },
      });
      return hireData;
    } else {
      const hireData = await this.prisma.hireTopEngineer.findMany({});
      return hireData;
    }
  }

  async deletehireEngineerData(id?: string) {
    if (id) {
      const hireData = await this.prisma.hireTopEngineer.delete({
        where: {
          id: id,
        },
      });
      return hireData;
    } else {
      const hireData = await this.prisma.hireTopEngineer.deleteMany({});
      return hireData;
    }
  }
}
