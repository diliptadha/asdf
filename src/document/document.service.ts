import * as AWS from 'aws-sdk';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as pdf from 'pdf-parse';

import { deleteFilesFromGCS, uploadFilesToGCS } from 'src/utils/functions';

import { Constants } from 'src/utils/constants';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { JWT } from 'google-auth-library';
import { PrismaService } from 'src/prisma.service';
import { ROOT_DIR } from 'rootDir';
import { Storage } from '@google-cloud/storage';
import axios from 'axios';

@Injectable()
export class DocumentService {
  private readonly storage: Storage;
  constructor(
    private prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {
    const filePath = path.resolve(ROOT_DIR,"eremote-hire-website-cloud.json");
    const creds = fs.readJsonSync(filePath);
      this.storage = new Storage({
        projectId: process.env.PROJECT_ID,
        keyFilename: process.env.KEYFILENAME,
      });
      const bucketName = process.env.CLOUD_BUCKET_NAME;
  }
  bucketName = process.env.CLOUD_BUCKET_NAME;
  async addDocuments(
    files: Express.Multer.File[],
    userId?: string,
    foldername?: string,
  ) {
    if (userId) {
      const folderName = foldername;
      const documentsUrls = await uploadFilesToGCS(files, folderName, this.storage, this.bucketName);

      const Documents = await this.prisma.document.create({
        data: {
          userId: userId,
          document: documentsUrls,
        },
      });
      return Documents.document;
    } else {
      const folderName = `${Constants.applyAsEngineer}/${Constants.resume}`;
      const documentsUrls = await uploadFilesToGCS(files, folderName, this.storage, this.bucketName);

      const Documents = await this.prisma.document.create({
        data: {
          // userId: userId,
          document: documentsUrls,
        },
      });
      return Documents.document;
    }
  }

  async updateDocuments(
    files: Express.Multer.File[],
    userId: string,
    folder: string,
    str: string,
  ) {
    const folderName = folder;
    const deleteImageFromGCSBucket = await deleteFilesFromGCS(
      files,
      folderName,
      this.storage,
      this.bucketName
    );

    if (!deleteImageFromGCSBucket) {
      throw new Error('issue occure');
    }
    const addDocument = await await uploadFilesToGCS(files, folderName, this.storage, this.bucketName);
    if (!addDocument) {
      throw new Error('File type not allowed');
    }
    return addDocument;
  }

  async fetchDocumentDetails() {
    // if (user_id) {
    //   const documentData = await this.prisma.document.findUnique({
    //     where: {
    //       user_id: user_id,
    //     },
    //   });
    //   return documentData;
    // } else {
    const documentData = await this.prisma.document.findMany();
    return documentData;
    // }
  }

  async deleteDocumentDetails(userId: string, id: string) {
    if (userId) {
      console.log(id);
      const userData = await this.prisma.user.findUnique({
        where: {
          userId,
        },
      });
      // const folderName = `${Constants.Documents}/${userId}`;
      // await deleteDocuments(
      //   this.s3,
      //   'document',
      //   this.prisma,
      //   userData.id,
      //   folderName,
      //   'document',
      //   str
      // );
      const data = await this.prisma.document.delete({
        where: {
          id: userData.id,
        },
      });
      return data;
    }
  }

  async checkKeywordsInPdf(pdfUrl: string, keywordsToCheck: string[]) {
    try {
      const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
      if (!response.data) {
        throw new Error('Empty response data');
      }

      const pdfBuffer = Buffer.from(response.data);
      const pdfData = await pdf(pdfBuffer);
      let pdfText = pdfData.text;

      pdfText = pdfText.toLowerCase();

      const foundKeywords = keywordsToCheck.filter((keyword) =>
        pdfText.includes(keyword.toLowerCase()),
      );

      if (foundKeywords.length > 0) {
        return {
          message: 'Keywords checked successfully',
          foundKeywords,
        };
      } else {
        throw new Error(
          'Keywords checked successfully, but none of the keywords were found',
        );
      }
    } catch (err) {
      console.error('Error checking keywords:', err.message);
      throw new Error('Keyword not match');
    }
  }

  async transcribeVideoMp4(videoUrl: string) {
    const deepgramApiKey = 'b4e09d9d1fb2dffaf4d39ef83ea8f98550e51ac1';
    const video = await this.downloadVideoFromGCS(videoUrl, this.bucketName, this.storage);
    try {
      const deepgramResponse = await axios.post(
        'https://api.deepgram.com/v1/listen',
        video.buffer,
        {
          headers: {
            Authorization: `Token ${deepgramApiKey}`,
            'Content-Type': 'video/mp4',
          },
        },
      );
      const transcriptionText =
        deepgramResponse.data.results.channels[0].alternatives[0].transcript;
      return transcriptionText;
    } catch (error) {
      throw new Error('Transcription failed');
    }
  }

  async downloadVideoFromGCS(videoUrl: string, bucketName: string, storage: Storage): Promise<Buffer> {
    try {
      const bucket = storage.bucket(bucketName);
      const file = bucket.file(videoUrl);
      const [fileExists] = await file.exists();
      if (!fileExists) {
        throw new Error('Video not found in GCS');
      }
      const data = await file.download();
      return data[0] as Buffer;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
}
