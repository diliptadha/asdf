import {
  Body,
  Controller,
  Post,
  UseGuards,
  Headers,
  HttpStatus,
  Res,
  Query,
  Get,
} from '@nestjs/common';
import { MyteamService } from './myteam.service';
import { AuthGuard } from '@nestjs/passport';
import { Constants, endpoints } from 'src/utils/constants';
import { decodeJwtToken, extractTokenFromHeader } from 'src/utils/functions';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { ApiBody, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { GiveBonusDto } from './dto/giveBonus.Dto';
import { GiveRaiseDto } from './dto/giveRaise.Dto';

@ApiTags(endpoints.myteam)
@Controller(endpoints.myteam)
export class MyteamController {
  constructor(
    private myTeamService: MyteamService,
    private jwtService: JwtService,
  ) {}

  @UseGuards(AuthGuard(Constants.JWT))
  @ApiQuery({ name: 'userId', required: false })
  @ApiSecurity('JWT-auth')
  @Get(endpoints.getHiredData)
  async getHiredData(
    @Res() response: Response,
    @Query('userId') userId?: string,
  ) {
    try {
      const hiredData = await this.myTeamService.getHiredData(userId);
      return response.status(HttpStatus.CREATED).json({
        message: Constants.getHiredDataSuccess,
        hiredData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.getHiredDataError,
        error: err.message,
      });
    }
  }

  @UseGuards(AuthGuard(Constants.JWT))
  @ApiSecurity('JWT-auth')
  @Get(endpoints.getRecommendationData)
  async getRecommendationData(@Res() response: Response) {
    try {
      const recommendationData =
        await this.myTeamService.getRecommendationData();
      return response.status(HttpStatus.CREATED).json({
        message: Constants.getRecommendationDataSuccess,
        recommendationData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.getRecommendationDataError,
        error: err.message,
      });
    }
  }

  @UseGuards(AuthGuard(Constants.JWT))
  @Post(endpoints.giveBonusData)
  @ApiBody({ type: GiveBonusDto })
  @ApiSecurity('JWT-auth')
  async giveBonusData(
    @Headers('authorization') authorization: string,
    @Body() giveBonusDto: GiveBonusDto,
    @Res() response: Response,
  ) {
    try {
      const token = extractTokenFromHeader(authorization);
      const userId = decodeJwtToken(token, this.jwtService);
      const bonusData = await this.myTeamService.giveBonusData(
        giveBonusDto,
        userId,
      );
      return response.status(HttpStatus.CREATED).json({
        message: Constants.giveBonusDataSuccess,
        bonusData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.giveBonusDataError,
        error: err.message,
      });
    }
  }

  @UseGuards(AuthGuard(Constants.JWT))
  @Post(endpoints.giveRaiseData)
  @ApiSecurity('JWT-auth')
  @ApiBody({ type: GiveRaiseDto })
  async giveRaiseData(
    @Headers('authorization') authorization: string,
    @Body() giveRaiseDto: GiveRaiseDto,
    @Res() response: Response,
  ) {
    try {
      const token = extractTokenFromHeader(authorization);
      const userId = decodeJwtToken(token, this.jwtService);
      const raiseData = await this.myTeamService.giveRaiseData(
        giveRaiseDto,
        userId,
      );
      return response.status(HttpStatus.CREATED).json({
        message: Constants.giveRaiseDataSuccess,
        raiseData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.giveRaiseDataError,
        error: err.message,
      });
    }
  }

  @UseGuards(AuthGuard(Constants.JWT))
  @ApiQuery({ name: 'userId', required: true })
  @ApiSecurity('JWT-auth')
  @Get(endpoints.getBonusData)
  async getBonusData(
    @Res() response: Response,
    @Query('userId') userId?: string,
  ) {
    try {
      const bonusData = await this.myTeamService.getBonusData(userId);
      return response.status(HttpStatus.CREATED).json({
        message: Constants.getBonusDataSuccess,
        bonusData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.getBonusDataError,
        error: err.message,
      });
    }
  }

  @UseGuards(AuthGuard(Constants.JWT))
  @ApiQuery({ name: 'userId', required: true })
  @ApiSecurity('JWT-auth')
  @Get(endpoints.getRaiseData)
  async getRaiseData(
    @Res() response: Response,
    @Query('userId') userId?: string,
  ) {
    try {
      const raiseData = await this.myTeamService.getRaiseData(userId);
      return response.status(HttpStatus.CREATED).json({
        message: Constants.getRaiseDataSuccess,
        raiseData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.getRaiseDataError,
        error: err.message,
      });
    }
  }
}
