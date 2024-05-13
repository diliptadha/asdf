import {
  Controller,
  Post,
  UseInterceptors,
  Headers,
  Res,
  Body,
  UploadedFiles,
  HttpStatus,
  Get,
  Query,
} from '@nestjs/common';
import { DevdashboardService } from './devdashboard.service';
import { Constants, endpoints } from 'src/utils/constants';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AddBenefitListDto } from './dto/addBenefitsList.dto';
import { Response } from 'express';
import { ApiBody, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AddRequestedBenefitsDto } from './dto/addQuestion.dto';
import { decodeJwtToken, extractTokenFromHeader } from 'src/utils/functions';
import { JwtService } from '@nestjs/jwt';
import { AddRemotePointsDto } from './dto/addremotepoints.dto';
import { AddRequestForPointsDto } from './dto/addRequestPointsDto';
import { AddFAQDto } from './dto/addFaq.dto';
import { AddPaymentDto } from './dto/addPayment.dto';
import { AddWeeklyReportDto } from './dto/addWeeklyReport.dto';
import { AddClientMonthlyReviewDto } from './dto/addClientMonthlyReview.dto';
import { AddVideoDto } from './dto/addVideo.dto';
import { WeeklySummariesDto } from './dto/addWeeklySummaries.dto';

@ApiTags(endpoints.devdashboard)
@Controller(endpoints.devdashboard)
export class DevdashboardController {
  constructor(
    private devDashboardService: DevdashboardService,
    private jwtService: JwtService,
  ) {}

  @Post(endpoints.addBenefits)
  @ApiSecurity('JWT-auth')
  @ApiBody({ type: AddBenefitListDto })
  @UseInterceptors(FilesInterceptor(Constants.files))
  async addBenefits(
    @Res() response: Response,
    @Body() addBenefitListDto: AddBenefitListDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      const benefitListData = await this.devDashboardService.addBenefits(
        files,
        addBenefitListDto,
      );
      return response.status(HttpStatus.CREATED).json({
        message: Constants.addBenefitsDataSuccess,
        benefitListData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.addBenefitsDataError,
        error: err.message,
      });
    }
  }

  @Get(endpoints.getBenefitsList)
  @ApiSecurity('JWT-auth')
  async getBenefitsList(@Res() response: Response) {
    try {
      const benefitListData = await this.devDashboardService.getBenefitsList();
      return response.status(HttpStatus.CREATED).json({
        message: Constants.getBenefitsListSuccess,
        benefitListData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.getBenefitsListError,
        error: err.message,
      });
    }
  }

  @Get(endpoints.getBenefitsListQuestion)
  @ApiSecurity('JWT-auth')
  @ApiQuery({ name: 'benefitId', required: true })
  async getBenefitsListQuestion(
    @Res() response: Response,
    @Query('benefitId') benefitId: string,
  ) {
    try {
      const benefitListData =
        await this.devDashboardService.getBenefitsListQuestion(benefitId);
      return response.status(HttpStatus.CREATED).json({
        message: Constants.getBenefitsListQuestionSuccess,
        benefitListData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.getBenefitsListQuestionError,
        error: err.message,
      });
    }
  }

  @Post(endpoints.deleteBenefitsData)
  @ApiSecurity('JWT-auth')
  @ApiQuery({ name: 'benefitsId', required: true })
  async deleteBenefitsData(
    @Res() response: Response,
    @Query('benefitsId') benefitsId: string,
  ) {
    try {
      const benefitListData =
        await this.devDashboardService.deleteBenefits(benefitsId);
      return response.status(HttpStatus.ACCEPTED).json({
        message: Constants.deleteBenefitsDataSuccess,
        benefitListData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.deleteBenefitsDataError,
        error: err.message,
      });
    }
  }

  @Post(endpoints.AddBenefitsQAData)
  @ApiSecurity('JWT-auth')
  @ApiBody({ type: AddRequestedBenefitsDto })
  async addBenefitsQAData(
    @Headers('authorization') authorization: string,
    @Res() response: Response,
    @Body() addRequestedBenefitsDto: AddRequestedBenefitsDto[],
  ) {
    try {
      const token = extractTokenFromHeader(authorization);
      const userId = decodeJwtToken(token, this.jwtService);
      const benefitQAData = await this.devDashboardService.addBenefitsQAData(
        addRequestedBenefitsDto,
        userId,
      );
      return response.status(HttpStatus.CREATED).json({
        message: Constants.AddBenefitsQADataSuccess,
        benefitQAData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.AddBenefitsQADataError,
        error: err.message,
      });
    }
  }

  @Get(endpoints.getBenefitsQAData)
  @ApiQuery({ name: 'userId', required: true })
  @ApiSecurity('JWT-auth')
  async getBenefitsQAData(
    @Res() response: Response,
    @Query('userId') userId: string,
  ) {
    try {
      const benefitsQAData =
        await this.devDashboardService.getBenefitsQAData(userId);
      return response.status(HttpStatus.FOUND).json({
        message: Constants.getBenefitsQADataSuccess,
        benefitsQAData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.getBenefitsQADataError,
        error: err.message,
      });
    }
  }

  @Post(endpoints.addRemotePoints)
  @ApiQuery({ name: 'userId', required: true })
  @ApiSecurity('JWT-auth')
  @ApiBody({ type: AddRemotePointsDto })
  async addRemotePoints(
    @Res() response: Response,
    @Query('userId') userId: string,
    @Body() addRemotePointsDto: AddRemotePointsDto,
  ) {
    try {
      const remotePointsData = await this.devDashboardService.addRemotePoints(
        addRemotePointsDto,
        userId,
      );
      return response.status(HttpStatus.CREATED).json({
        message: Constants.AddRemotePointsDataSuccess,
        remotePointsData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.AddRemotePointsDataError,
        error: err.message,
      });
    }
  }

  @Get(endpoints.getRemotePointsHistory)
  @ApiQuery({ name: 'userId', required: true })
  @ApiSecurity('JWT-auth')
  async getRemotePointsHistory(
    @Res() response: Response,
    @Query('userId') userId: string,
  ) {
    try {
      const remotePointsData =
        await this.devDashboardService.getRemotePointsHistory(userId);
      return response.status(HttpStatus.CREATED).json({
        message: Constants.getRemotePointsHistoryDataSuccess,
        remotePointsData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.getRemotePointsHistoryDataError,
        error: err.message,
      });
    }
  }

  @Get(endpoints.getTotalRemotePoints)
  @ApiQuery({ name: 'userId', required: true })
  @ApiSecurity('JWT-auth')
  async getTotalRemotePoints(
    @Res() response: Response,
    @Query('userId') userId: string,
  ) {
    try {
      const remotePointsData =
        await this.devDashboardService.getTotalRemotePoints(userId);
      return response.status(HttpStatus.CREATED).json({
        message: Constants.getTotalRemotePointsDataSuccess,
        remotePointsData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.getTotalRemotePointsDataError,
        error: err.message,
      });
    }
  }

  @Post(endpoints.redeemPoints)
  @ApiQuery({ name: 'userId', required: true })
  @ApiSecurity('JWT-auth')
  @ApiBody({ type: AddRequestForPointsDto })
  async RedeemPoints(
    @Res() response: Response,
    @Query('userId') userId: string,
    @Body() addRequestForPointsDto: AddRequestForPointsDto,
  ) {
    try {
      const remotePointsData = await this.devDashboardService.redeemPoints(
        addRequestForPointsDto,
        userId,
      );
      return response.status(HttpStatus.CREATED).json({
        message: Constants.addRequestForPointsSuccess,
        remotePointsData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.addRequestForPointsError,
        error: err.message,
      });
    }
  }

  @Get(endpoints.getRequestForRedeemPoints)
  @ApiQuery({ name: 'userId', required: true })
  @ApiSecurity('JWT-auth')
  async getRequestForRedeemPoints(
    @Res() response: Response,
    @Query('userId') userId: string,
  ) {
    try {
      const redeemPointsData =
        await this.devDashboardService.getRequestForRedeemPoints(userId);
      return response.status(HttpStatus.CREATED).json({
        message: Constants.getRequestForRedeemPointsSuccess,
        redeemPointsData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.getRequestForRedeemPointsSuccess,
        error: err.message,
      });
    }
  }

  @Post(endpoints.redeemPointsRequestApprove)
  @ApiQuery({ name: 'userId', required: true })
  @ApiSecurity('JWT-auth')
  async RedeemPointsRequestApprove(
    @Res() response: Response,
    @Query('userId') userId: string,
  ) {
    try {
      const redeemPointsData =
        await this.devDashboardService.redeemPointsRequestApprove(userId);
      return response.status(HttpStatus.CREATED).json({
        message: Constants.RedeemPointsRequestApproveSuccess,
        redeemPointsData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.RedeemPointsRequestApproveError,
        error: err.message,
      });
    }
  }

  @Post(endpoints.addFAQData)
  @ApiSecurity('JWT-auth')
  @ApiBody({ type: AddFAQDto })
  async addFAQData(@Res() response: Response, @Body() addFAQDto: AddFAQDto[]) {
    try {
      const faqData = await this.devDashboardService.addFAQData(addFAQDto);
      return response.status(HttpStatus.CREATED).json({
        message: Constants.addFAQDataSuccessfully,
        faqData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.addFAQDataError,
        error: err.message,
      });
    }
  }

  @Get(endpoints.getFAQData)
  @ApiQuery({ name: 'pageName', required: true })
  @ApiSecurity('JWT-auth')
  async getFAQData(
    @Res() response: Response,
    @Query('pageName') pageName: string,
  ) {
    try {
      const faqData = await this.devDashboardService.getFAQData(pageName);
      return response.status(HttpStatus.CREATED).json({
        message: Constants.getFAQDataSuccess,
        faqData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.getFAQDataError,
        error: err.message,
      });
    }
  }

  @Post(endpoints.assignSuccessManager)
  @ApiSecurity('JWT-auth')
  @ApiQuery({ name: 'userId', required: true })
  @ApiQuery({ name: 'managerUserId', required: true })
  async assignSuccessManager(
    @Res() response: Response,
    @Query('userId') userId: string,
    @Query('managerUserId') managerUserId: string,
  ) {
    try {
      const managerData = await this.devDashboardService.assignSuccessManager(
        userId,
        managerUserId,
      );
      return response.status(HttpStatus.CREATED).json({
        message: Constants.assignSuccessManagerSuccessfully,
        managerData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.assignSuccessManagerError,
        error: err.message,
      });
    }
  }

  @Get(endpoints.getSuccessManagerData)
  @ApiSecurity('JWT-auth')
  async getSuccessManagerData(@Res() response: Response) {
    try {
      const managerData =
        await this.devDashboardService.getSuccessManagerData();
      return response.status(HttpStatus.CREATED).json({
        message: Constants.getSuccessManagerDataSuccessfully,
        managerData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.getSuccessManagerDataError,
        error: err.message,
      });
    }
  }

  @Get(endpoints.getdeveloperManagerData)
  @ApiSecurity('JWT-auth')
  @ApiQuery({ name: 'userId', required: true })
  async getDeveloperManagerData(
    @Res() response: Response,
    @Query('userId') userId: string,
  ) {
    try {
      const managerData =
        await this.devDashboardService.getDevelpoerManagerData(userId);
      return response.status(HttpStatus.CREATED).json({
        message: Constants.getDeveloperManagerDataSuccessfully,
        managerData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.getDeveloperManagerDataError,
        error: err.message,
      });
    }
  }

  @Post(endpoints.addPaymentData)
  @ApiSecurity('JWT-auth')
  @ApiBody({ type: AddPaymentDto })
  @UseInterceptors(FilesInterceptor(Constants.files))
  async addPaymentData(
    @Res() response: Response,
    @Body() addPaymentDto: AddPaymentDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      const addPaymentData = await this.devDashboardService.addPayoutData(
        addPaymentDto,
        files,
      );
      return response.status(HttpStatus.CREATED).json({
        message: Constants.addPaymentDataSuccessfully,
        addPaymentData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.addPaymentDataError,
        error: err.message,
      });
    }
  }

  @Get(endpoints.getPaymentData)
  @ApiSecurity('JWT-auth')
  @ApiQuery({ name: 'userId', required: true })
  async getPaymentData(
    @Res() response: Response,
    @Query('userId') userId: string,
  ) {
    try {
      const getPaymentData =
        await this.devDashboardService.getPaymentData(userId);
      return response.status(HttpStatus.CREATED).json({
        message: Constants.getPaymentDataSuccess,
        getPaymentData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.getPaymentDataError,
        error: err.message,
      });
    }
  }

  @Post(endpoints.addWeeklyReportData)
  @ApiSecurity('JWT-auth')
  @ApiBody({ type: AddWeeklyReportDto })
  async addWeeklyReportData(
    @Res() response: Response,
    @Body() addWeeklyReportDto: AddWeeklyReportDto,
  ) {
    try {
      const weeklyReportData =
        await this.devDashboardService.addWeeklyReportData(addWeeklyReportDto);
      return response.status(HttpStatus.CREATED).json({
        message: Constants.addWeeklyReportDataSuccessfully,
        weeklyReportData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.addWeeklyReportDataError,
        error: err.message,
      });
    }
  }

  @Get(endpoints.getWeeklyReportData)
  @ApiSecurity('JWT-auth')
  @ApiQuery({ name: 'userId', required: true })
  async getWeeklyReportData(
    @Res() response: Response,
    @Query('userId') userId: string,
  ) {
    try {
      const weeklyReportData =
        await this.devDashboardService.getWeeklyReportData(userId);
      return response.status(HttpStatus.CREATED).json({
        message: Constants.getWeeklyReportDataSuccess,
        weeklyReportData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.getWeeklyReportDataError,
        error: err.message,
      });
    }
  }

  @Post(endpoints.addClientMonthlyReview)
  @ApiSecurity('JWT-auth')
  @ApiBody({ type: AddClientMonthlyReviewDto })
  async AddClientMonthlyReviewData(
    @Res() response: Response,
    @Body() addClientMonthlyReviewDto: AddClientMonthlyReviewDto,
  ) {
    try {
      const clientMonthlyReviewData =
        await this.devDashboardService.AddClientMonthlyReviewData(
          addClientMonthlyReviewDto,
        );
      return response.status(HttpStatus.CREATED).json({
        message: Constants.addClientMonthlyReviewDataSuccess,
        clientMonthlyReviewData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.addClientMonthlyReviewDataError,
        error: err.message,
      });
    }
  }

  @Get(endpoints.getClientMonthlyReview)
  @ApiSecurity('JWT-auth')
  @ApiQuery({ name: 'userId', required: true })
  async GetClientMonthlyReview(
    @Res() response: Response,
    @Query('userId') userId: string,
  ) {
    try {
      const GetClientMonthlyReview =
        await this.devDashboardService.GetClientMonthlyReviewData(userId);
      return response.status(HttpStatus.CREATED).json({
        message: Constants.getClientMonthlyReviewSuccess,
        GetClientMonthlyReview,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.getClientMonthlyReviewError,
        error: err.message,
      });
    }
  }

  @Post(endpoints.addVideo)
  @ApiSecurity('JWT-auth')
  @ApiBody({ type: AddVideoDto })
  async addVideoData(
    @Res() response: Response,
    @Body() addVideoDto: AddVideoDto,
  ) {
    try {
      const videoData =
        await this.devDashboardService.addVideoData(addVideoDto);

      return response.status(HttpStatus.CREATED).json({
        message: Constants.addVideoSuccess,
        videoData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.addVideoError,
        error: err.message,
      });
    }
  }

  @Get(endpoints.getVideo)
  @ApiSecurity('JWT-auth')
  async GetVideoUrls(@Res() response: Response) {
    try {
      const videoData = await this.devDashboardService.GetVideosData();
      return response.status(HttpStatus.CREATED).json({
        message: Constants.getVideoDataSuccess,
        videoData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.getVideoDataError,
        error: err.message,
      });
    }
  }

  @Get(endpoints.deleteVideo)
  @ApiSecurity('JWT-auth')
  @ApiQuery({ name: 'id', required: true })
  async DeleteVideoUrls(@Res() response: Response, @Query('id') id: string) {
    try {
      const deletedVideoData =
        await this.devDashboardService.DeleteVideoData(id);
      return response.status(HttpStatus.CREATED).json({
        message: Constants.deleteVideoDataSuccess,
        deletedVideoData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.deleteVideoDataError,
        error: err.message,
      });
    }
  }

  @Post(endpoints.addWeeklySummariesData)
  @ApiSecurity('JWT-auth')
  @ApiBody({ type: WeeklySummariesDto })
  async addWeeklySummariesData(
    @Headers('authorization') authorization: string,
    @Res() response: Response,
    @Body() addWeeklySummariesDto: WeeklySummariesDto,
  ) {
    try {
      const token = extractTokenFromHeader(authorization);
      const userId = decodeJwtToken(token, this.jwtService);
      const weeklySummariesData =
        await this.devDashboardService.addWeeklySummariesData(
          addWeeklySummariesDto,
          userId,
        );
      return response.status(HttpStatus.CREATED).json({
        message: Constants.addWeeklySummariesDataSuccessfully,
        weeklySummariesData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.addWeeklySummariesDataError,
        error: err.message,
      });
    }
  }

  @Get(endpoints.getWeeklySummariesData)
  @ApiSecurity('JWT-auth')
  @ApiQuery({ name: 'userId', required: true })
  async getWeeklySummariesData(
    @Res() response: Response,
    @Query('userId') userId: string,
  ) {
    try {
      const weeklySummariesData =
        await this.devDashboardService.getWeeklySummariesData(userId);
      return response.status(HttpStatus.CREATED).json({
        message: Constants.getWeeklySummariesDataSuccess,
        weeklySummariesData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.getWeeklySummariesDataError,
        error: err.message,
      });
    }
  }
}
