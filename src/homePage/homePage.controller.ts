import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  Headers,
  Get,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { HomePageService } from './homePage.service';
import { JwtService } from '@nestjs/jwt';
import { Constants, endpoints } from 'src/utils/constants';
import { Response } from 'express';
import { ClientReviewDto } from './dto/clientReview.dto';
import { CommunityDto } from './dto/community.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { SuccessStoryDto } from './dto/successstory.dto';
import { AddTrustedByDto } from './dto/addtrustedbylogo.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UpdateTrustedByDto } from './dto/updatetrustedlogo.dto';

@ApiTags(endpoints.home)
@Controller(endpoints.home)
export class HomePageController {
  constructor(
    private homePageService: HomePageService,
    private jwtService: JwtService,
  ) {}

  @Post(endpoints.addClientReview)
  @ApiSecurity('JWT-auth')
  @ApiQuery({ name: 'userId', required: true })
  @ApiBody({ type: ClientReviewDto })
  async addClientReview(
    @Headers('authorization') authorization: string,
    @Res() response: Response,
    @Query('userId') userId: string,
    @Body() clientReviewDto: ClientReviewDto,
  ) {
    try {
      const clientReviewData = await this.homePageService.addClientReview(
        userId,
        clientReviewDto,
      );
      return response.status(HttpStatus.CREATED).json({
        message: Constants.addClientReviewDataSuccess,
        clientReviewData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.addClientReviewDataError,
        error: err.message,
      });
    }
  }

  @Get(endpoints.getClientReview)
  async getClientReview(@Res() response: Response) {
    try {
      const clientReviewData = await this.homePageService.getClientReview();
      return response.status(HttpStatus.CREATED).json({
        message: Constants.getClientReviewDataSuccess,
        clientReviewData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.getClientReviewDataSuccess,
        error: err.message,
      });
    }
  }

  @Get(endpoints.getAvailableHireDeveloper)
  async getAvailableHireDeveloper(@Res() response: Response) {
    try {
      const developerData =
        await this.homePageService.getAvailableHireDeveloper();
      return response.status(HttpStatus.CREATED).json({
        message: Constants.getAvailableHireDeveloperSuccess,
        developerData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.getAvailableHireDeveloperError,
        error: err.message,
      });
    }
  }

  @Get(endpoints.getTeamDetails)
  async getTeamDetailsData(@Res() response: Response) {
    try {
      const teamDetailsData = await this.homePageService.getTeamDetailsData();
      return response.status(HttpStatus.CREATED).json({
        message: Constants.getTeamDetailsDataSuccess,
        teamDetailsData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.getTeamDetailsDataError,
        error: err.message,
      });
    }
  }

  @Post(endpoints.addCommunityDetails)
  @ApiQuery({ name: 'userId', required: true })
  @ApiSecurity('JWT-auth')
  @ApiBody({ type: CommunityDto })
  async addCommunityDetails(
    @Query('userId') userId: string,
    @Res() response: Response,
    @Body() communityDto: CommunityDto,
  ) {
    try {
      const communityDetails = await this.homePageService.addCommunityDetails(
        userId,
        communityDto,
      );
      return response.status(HttpStatus.CREATED).json({
        message: Constants.addCommunityDetailsSuccess,
        communityDetails,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.addCommunityDetailsDataError,
        error: err.message,
      });
    }
  }

  @Get(endpoints.getCommunityDetails)
  async getCommunityDetailsData(@Res() response: Response) {
    try {
      const communityDetailsData =
        await this.homePageService.getCommunityDetailsData();
      return response.status(HttpStatus.CREATED).json({
        message: Constants.getCommunityDetailsDataSuccess,
        communityDetailsData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.getCommunityDetailsDataError,
        error: err.message,
      });
    }
  }

  @Post(endpoints.addSuccessStory)
  @ApiQuery({ name: 'userId', required: true })
  @ApiSecurity('JWT-auth')
  @ApiBody({ type: SuccessStoryDto })
  async addSuccessStoryDetails(
    @Query('userId') userId: string,
    @Res() response: Response,
    @Body() SuccessStoryDto: SuccessStoryDto,
  ) {
    try {
      const successStoryDetails =
        await this.homePageService.addSuccessStoryDetails(
          userId,
          SuccessStoryDto,
        );
      return response.status(HttpStatus.CREATED).json({
        message: Constants.addSuccessStoryDetailsSuccess,
        successStoryDetails,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.addSuccessStoryDetailsDataError,
        error: err.message,
      });
    }
  }

  @Get(endpoints.getSuccessStoryDetails)
  async getSuccessStoryDetailsData(@Res() response: Response) {
    try {
      const successStoryDetailsData =
        await this.homePageService.getSuccessStoryData();
      return response.status(HttpStatus.CREATED).json({
        message: Constants.getSuccessStoryDetailsDataSuccess,
        successStoryDetailsData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.getSuccessStoryDetailsDataError,
        error: err.message,
      });
    }
  }

  @Post(endpoints.addTrustedByLogoData)
  @ApiBody({ type: AddTrustedByDto })
  @ApiSecurity('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor(Constants.files))
  @ApiQuery({ name: 'id', required: false })
  async addUpdateTrustedByLogoDto(
    @Res() response: Response,
    @Body() addTrustedByDto: AddTrustedByDto,
    @Body() updateTrustedByDto: UpdateTrustedByDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Query('id') id?: string,
  ) {
    try {
      const logoData = await this.homePageService.addUpdateTrustedByLogo(
        addTrustedByDto,
        files,
        updateTrustedByDto,
        id,
      );
      return response.status(HttpStatus.CREATED).json({
        message: Constants.logoAddedSuccess,
        logoData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.logoAddError,
        error: err.message,
      });
    }
  }

  @Get(endpoints.getTrustedByLogoData)
  async getTrustedByLogoData(@Res() response: Response) {
    try {
      const logoData = await this.homePageService.getTrustedByLogoData();
      return response.status(HttpStatus.CREATED).json({
        message: Constants.logoGetSuccess,
        logoData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.logoGetError,
        error: err.message,
      });
    }
  }
}
