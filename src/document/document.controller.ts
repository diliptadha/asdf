import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { Constants, endpoints } from 'src/utils/constants';
import { ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { PrismaService } from 'src/prisma.service';

@ApiTags(endpoints.document)
@Controller(endpoints.document)
export class DocumentController {
  constructor(
    private documentService: DocumentService,
    private prisma: PrismaService,
  ) {}

  @Post(endpoints.addDocuments)
  @ApiQuery({ name: 'userId', required: false })
  @ApiSecurity('JWT-auth')
  @UseInterceptors(FilesInterceptor(Constants.files))
  async addDocument(
    @UploadedFiles() files: Express.Multer.File[],
    @Res() response: Response,
    @Query('userId') userId?: string,
  ) {
    try {
      const DocumentData = await this.documentService.addDocuments(
        files,
        userId,
      );
      return response.status(HttpStatus.CREATED).json({
        message: Constants.addDocumentSuccess,
        DocumentData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.addDocumentError,
        error: err.message,
      });
    }
  }

  @Post(endpoints.updateDocuments)
  @ApiQuery({ name: 'userId', required: true })
  @ApiSecurity('JWT-auth')
  @UseInterceptors(FilesInterceptor(Constants.files))
  async updateDocument(
    @UploadedFiles() files: Express.Multer.File[],
    @Res() response: Response,
    @Query('userId') userId: string,
  ) {
    try {
      const folderName = '';
      const str = '';
      const DocumentData = await this.documentService.updateDocuments(
        files,
        userId,
        folderName,
        str,
      );
      return response.status(HttpStatus.CREATED).json({
        message: Constants.addDocumentSuccess,
        DocumentData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.addDocumentError,
        error: err.message,
      });
    }
  }

  @Get(endpoints.fetchDocumentData)
  @ApiSecurity('JWT-auth')
  async fetchDocumentDetails(@Res() response: Response) {
    try {
      const documentData = await this.documentService.fetchDocumentDetails();
      return response.status(HttpStatus.CREATED).json({
        message: Constants.userDocumentDetailsGetSuccess,
        documentData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.userDocumentDetailsGetError,
        error: err.message,
      });
    }
  }

  @Post(endpoints.deleteDocumentData)
  @ApiQuery({ name: 'userId', required: false })
  @ApiSecurity('JWT-auth')
  async deleteDocumentDetails(
    @Res() response: Response,
    @Query('userId') userId: string,
  ) {
    try {
      const document = await this.prisma.document.findUnique({
        where: {
          userId,
        },
      });
      const documentData = await this.documentService.deleteDocumentDetails(
        userId,
        document.id,
      );
      return response.status(HttpStatus.CREATED).json({
        message: Constants.deleteDocumentDataSuccess,
        documentData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.deleteDocumentDataError,
        error: err.message,
      });
    }
  }

  @Get('check-keywords')
  async checkKeywords(
    @Body('pdfUrl') pdfUrl: string,
    @Body('keywords') keywords: string[],
    @Res() response: Response,
  ) {
    try {
      const foundKeywords = await this.documentService.checkKeywordsInPdf(
        pdfUrl,
        keywords,
      );
      response.status(HttpStatus.FOUND).json({
        message: Constants.DocumentKeywordGetSuccess,
        foundKeywords,
      });
    } catch (err) {
      response.status(HttpStatus.NOT_FOUND).json({
        message: Constants.DocumentKeywordGetError,
        error: err.message,
      });
    }
  }

  @Post('transcribe')
  async transcribeVideo(
    @Body('videoUrl') videoUrl: string,
    @Res() response: Response,
  ) {
    try {
      const transcript =
        await this.documentService.transcribeVideoMp4(videoUrl);
      response.status(HttpStatus.FOUND).json({
        message: Constants.DocumentTranscribeGetSuccess,
        transcript,
      });
    } catch (err) {
      response.status(HttpStatus.NOT_FOUND).json({
        message: Constants.DocumentTranscribeGetError,
        error: err.message,
      });
    }
  }
}
