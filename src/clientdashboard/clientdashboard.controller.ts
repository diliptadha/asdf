import {
  Controller,
  Get,
  Res,
  Headers,
  HttpStatus,
  Post,
  UseInterceptors,
  UploadedFiles,
  Body,
} from '@nestjs/common';
import { ApiBody, ApiSecurity } from '@nestjs/swagger';
import { Constants, endpoints } from 'src/utils/constants';
import { decodeJwtToken, extractTokenFromHeader } from 'src/utils/functions';
import { ClientdashboardService } from './clientdashboard.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { EremoteLabsDto } from './dto/eremoteLab.dto';
import { FilterDTO } from './dto/filter.dto';

@Controller('clientdashboard')
export class ClientdashboardController {
  constructor(
    private clientdashboardService: ClientdashboardService,
    private jwtService: JwtService,
  ) {}

  @Get(endpoints.getRaiseHistoryData)
  @ApiSecurity('JWT-auth')
  async getRaiseHistoryData(
    @Headers('authorization') authorization: string,
    @Res() response: Response,
  ) {
    try {
      const token = extractTokenFromHeader(authorization);
      const userId = decodeJwtToken(token, this.jwtService);
      const getRaiseHistoryData =
        await this.clientdashboardService.getRaiseHistoryData(userId);
      return response.status(HttpStatus.CREATED).json({
        message: Constants.developerRaiseHistoryDataSuccess,
        getRaiseHistoryData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.developerRaiseHistoryDataError,
        error: err.message,
      });
    }
  }

  @Get(endpoints.getBonusHistoryData)
  @ApiSecurity('JWT-auth')
  async getBonusHistoryData(
    @Headers('authorization') authorization: string,
    @Res() response: Response,
  ) {
    try {
      const token = extractTokenFromHeader(authorization);
      const userId = decodeJwtToken(token, this.jwtService);
      const getBonusHistoryData =
        await this.clientdashboardService.getBonusHistoryData(userId);
      return response.status(HttpStatus.CREATED).json({
        message: Constants.developerBonusHistoryDataSuccess,
        getBonusHistoryData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.developerBonusHistoryDataError,
        error: err.message,
      });
    }
  }

  @Get(endpoints.getTotalBonusData)
  @ApiSecurity('JWT-auth')
  async getTotalBonusData(
    @Headers('authorization') authorization: string,
    @Res() response: Response,
  ) {
    try {
      const token = extractTokenFromHeader(authorization);
      const userId = decodeJwtToken(token, this.jwtService);
      const totalBonusData =
        await this.clientdashboardService.getTotalBonusData(userId);
      return response.status(HttpStatus.CREATED).json({
        message: Constants.totalBonusDataSuccess,
        totalBonusData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.totalBonusDataError,
        error: err.message,
      });
    }
  }

  @Get(endpoints.getClientPaymentData)
  @ApiSecurity('JWT-auth')
  async getPayementData(
    @Headers('authorization') authorization: string,
    @Res() response: Response,
  ) {
    try {
      const token = extractTokenFromHeader(authorization);
      const userId = decodeJwtToken(token, this.jwtService);
      const getPayementData =
        await this.clientdashboardService.getClientPaymentData(userId);
      return response.status(HttpStatus.CREATED).json({
        message: Constants.getPaymentDataSuccess,
        getPayementData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.getPaymentDataError,
        error: err.message,
      });
    }
  }

  @Get(endpoints.getMonthlyPaymentData)
  @ApiSecurity('JWT-auth')
  async getMonthlyPaymentData(
    @Headers('authorization') authorization: string,
    @Res() response: Response,
  ) {
    try {
      const token = extractTokenFromHeader(authorization);
      const userId = decodeJwtToken(token, this.jwtService);
      const monthlyPaymentData =
        await this.clientdashboardService.getMonthlyPaymentData(userId);
      return response.status(HttpStatus.CREATED).json({
        message: Constants.getMonthlyPaymentDataSuccess,
        monthlyPaymentData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.getMonthlyPaymentDataError,
        error: err.message,
      });
    }
  }

  @Get(endpoints.getTotalMonthlyPaymentData)
  @ApiSecurity('JWT-auth')
  async getTotalMonthlyPaymentData(
    @Headers('authorization') authorization: string,
    @Res() response: Response,
  ) {
    try {
      const token = extractTokenFromHeader(authorization);
      const userId = decodeJwtToken(token, this.jwtService);
      const totalMonthlyPaymentData =
        await this.clientdashboardService.getTotalMonthlyPaymentData(userId);
      return response.status(HttpStatus.CREATED).json({
        message: Constants.getTotalMonthlyPaymentDataSuccess,
        totalMonthlyPaymentData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.getTotalMonthlyPaymentDataError,
        error: err.message,
      });
    }
  }

  @Post(endpoints.addERemoteLabData)
  @UseInterceptors(FilesInterceptor(Constants.files))
  async addERemoteLabData(
    @Body() eremoteLabsDto: EremoteLabsDto,
    @Headers('authorization') authorization: string,
    @Res() response: Response,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    try {
      const token = extractTokenFromHeader(authorization);
      const userId = decodeJwtToken(token, this.jwtService);
      const eRemoteLabData =
        await this.clientdashboardService.addERemoteLabData(
          eremoteLabsDto,
          files,
          userId,
        );
      return response.status(HttpStatus.CREATED).json({
        message: Constants.addEremoteLabDataSuccess,
        eRemoteLabData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.addEremoteLabDataSuccess,
        error: err.message,
      });
    }
  }

  @Get(endpoints.getERemoteLabData)
  async getERemoteLabData(
    @Headers('authorization') authorization: string,
    @Res() response: Response,
  ) {
    try {
      const token = extractTokenFromHeader(authorization);
      const userId = decodeJwtToken(token, this.jwtService);
      const eRemoteLabData =
        await this.clientdashboardService.getERemoteLabData(userId);
      return response.status(HttpStatus.CREATED).json({
        message: Constants.getEremoteLabDataSuccess,
        eRemoteLabData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.getEremoteLabDataSuccess,
        error: err.message,
      });
    }
  }

  @Get(endpoints.getSearchTalentData)
  @ApiSecurity('JWT-auth')
  async getSearchTalentData(
    @Headers('authorization') authorization: string,
    @Res() response: Response,
  ) {
    try {
      const token = extractTokenFromHeader(authorization);
      const userId = decodeJwtToken(token, this.jwtService);
      const getSearchTalentData =
        await this.clientdashboardService.getSearchTalentData(userId);
      return response.status(HttpStatus.CREATED).json({
        message: Constants.getSearchTalentDataSuccess,
        getSearchTalentData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.getSearchTalentDataError,
        error: err.message,
      });
    }
  }

  @Post(endpoints.filterSearchTalent)
  @ApiSecurity('JWT-auth')
  @ApiBody({ type: FilterDTO })
  async filterClients(
    @Headers('authorization') authorization: string,
    @Body() filterDto: FilterDTO,
  ) {
    try {
      const token = extractTokenFromHeader(authorization);
      const userId = decodeJwtToken(token, this.jwtService);

      if (Object.keys(filterDto).length === 0) {
        return { message: 'You must apply filter.' };
      }

      const filteredClients =
        await this.clientdashboardService.filterSearchTalent(filterDto, userId);

      if (filteredClients.length === 0) {
        return { message: Constants.noMatchingRecourdsFound };
      }

      return {
        message: Constants.filterAppliedSuccessfully,
        clients: filteredClients,
      };
    } catch (error) {
      return { message: Constants.errorApplyingFilter, error: error.message };
    }
  }
}
