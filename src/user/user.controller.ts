import {
  Body,
  Controller,
  Post,
  Query,
  Res,
  HttpStatus,
  Headers,
  Get,
  UseInterceptors,
  UploadedFiles,
  HttpException,
} from '@nestjs/common';
import { Constants, endpoints } from 'src/utils/constants';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserService } from './user.service';
import { Response } from 'express';
import {
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth/auth.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { decodeJwtToken, extractTokenFromHeader } from 'src/utils/functions';
import { JwtService } from '@nestjs/jwt';
import { GiveFeedbackDto } from './dto/addFeedback.dto';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags(endpoints.user)
@Controller(endpoints.user)
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post(endpoints.updateUser)
  @ApiQuery({ name: 'userId', required: true })
  @ApiSecurity('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @ApiQuery({ name: 'vettingResultId', required: false })
  @ApiQuery({ name: 'educattionId', required: false })
  @ApiQuery({ name: 'experienceId', required: false })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: Object })
  @UseInterceptors(FilesInterceptor(Constants.files))
  async updateUser(
    @UploadedFiles() files: Express.Multer.File[],
    @Res() response: Response,
    @Body() updateUserDto: UpdateUserDto,
    @Query('vettingResultId') vettingResultId: string,
    @Query('educationId') educationId: string,
    @Query('experienceId') experienceId: string,
    @Query('userId') userId: string,
  ) {
    try {
      const userData = await this.userService.updateUser(
        updateUserDto,
        files,
        userId,
        vettingResultId,
        educationId,
        experienceId,
      );
      return response.status(HttpStatus.CREATED).json({
        message: userId
          ? Constants.updateUserSuccess
          : Constants.creatUserSuccess,
        userData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: userId ? Constants.updateUserError : Constants.creatUserError,
        error: err.message,
      });
    }
  }

  @Get(endpoints.getUserData)
  @ApiSecurity('JWT-auth')
  @ApiQuery({ name: 'userId', required: false })
  async getUserData(
    @Res() response: Response,
    @Query('userId') userId?: string,
  ) {
    try {
      const userData = await this.userService.getUserData(userId);
      return response.status(HttpStatus.CREATED).json({
        message: Constants.getUserSuccess,
        userData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.getUserError,
        error: err.message,
      });
    }
  }

  @Post(endpoints.deleteUserData)
  @ApiSecurity('JWT-auth')
  @ApiQuery({ name: 'userId', required: false })
  async deleteUserData(
    @Res() response: Response,
    @Query('userId') userId?: string,
  ) {
    try {
      const userData = await this.userService.deleteUserData(userId);
      return response.status(HttpStatus.CREATED).json({
        message: Constants.deleteUserSuccess,
        userData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.deleteUserError,
        error: err.message,
      });
    }
  }

  @Post(endpoints.login)
  @ApiBody({ type: LoginDto })
  async signIn(@Body() loginDto: LoginDto, @Res() response: Response) {
    try {
      const signInData = await this.authService.signIn(loginDto);
      return response.status(HttpStatus.OK).json({
        message: Constants.signInSuccess,
        signInData,
      });
    } catch (err) {
      return response.status(HttpStatus.UNAUTHORIZED).json({
        message: Constants.signInError,
        error: err.message,
      });
    }
  }

  @Post(endpoints.forgotPassword)
  @ApiBody({ type: ForgotPasswordDto })
  async forgotPassword(
    @Res() response: Response,
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ) {
    try {
      const signUpData = await this.userService.forgotPassword(
        forgotPasswordDto.emailId,
        forgotPasswordDto.OTP,
        forgotPasswordDto.password,
        forgotPasswordDto.confirmPassword,
      );
      return response.status(HttpStatus.CREATED).json({
        message: Constants.passwordChangeSuccess,
        signUpData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.passwordChangeError,
        error: err.message,
      });
    }
  }

  @Post(endpoints.giveFeedback)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: GiveFeedbackDto })
  @ApiSecurity('JWT-auth')
  @UseInterceptors(FilesInterceptor(Constants.files))
  async giveFeedback(
    @Headers('authorization') authorization: string,
    @Res() response: Response,
    @Body() giveFeedbackDto: GiveFeedbackDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      const token = extractTokenFromHeader(authorization);
      const userId = decodeJwtToken(token, this.jwtService);
      const feedBackData = await this.userService.feedBackData(
        userId,
        files,
        giveFeedbackDto,
      );
      return response.status(HttpStatus.CREATED).json({
        message: Constants.feedBackDataSuccess,
        feedBackData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.feedBackDataError,
        error: err.message,
      });
    }
  }

  @Post(endpoints.sendOTPforForgotPassword)
  @ApiQuery({ name: 'emailId', required: true })
  async emailData(
    @Res() response: Response,
    @Query('emailId') emailId: string,
  ) {
    try {
      const emailData =
        await this.userService.sendOTPforForgotPassword(emailId);
      return response.status(HttpStatus.OK).json({
        message: Constants.emailSentSuccess,
        emailData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.emailSentError,
        error: err.message,
      });
    }
  }

  @Post(endpoints.addCertificate)
  @ApiQuery({ name: 'emailId', required: true })
  @UseInterceptors(FilesInterceptor(Constants.files))
  // @ApiSecurity('JWT-auth')
  async addCertificate(
    @UploadedFiles() files: Express.Multer.File[],
    @Res() response: Response,
    @Query('emailId') emailId: string,
  ) {
    try {
      const certificateData = await this.userService.addCertificate(
        emailId,
        files,
      );
      return response.status(HttpStatus.CREATED).json({
        message: Constants.creatUserSuccess,
        certificateData,
      });
    } catch (err) {
      if (
        err instanceof HttpException &&
        err.getStatus() === HttpStatus.UNAUTHORIZED
      ) {
        return response.status(HttpStatus.UNAUTHORIZED).json({
          message: 'User already exists',
          error: err.message,
        });
      } else {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: Constants.creatUserError,
          error: err.message,
        });
      }
    }
  }

  @Get(endpoints.getCertificateData)
  @ApiQuery({ name: 'userId', required: false })
  @ApiSecurity('JWT-auth')
  async getCertificateData(
    @Res() response: Response,
    @Query('userId') userId?: string,
  ) {
    try {
      const certificateData = await this.userService.getCertificateData(userId);
      return response.status(HttpStatus.CREATED).json({
        message: Constants.getCertificateDataSuccess,
        certificateData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.getCertificateDataError,
        error: err.message,
      });
    }
  }

  @Post(endpoints.developerAssignToClient)
  @ApiQuery({ name: 'user_Id', required: false })
  @ApiSecurity('JWT-auth')
  async developerAssignToClient(
    @Headers('authorization') authorization: string,
    @Res() response: Response,
    @Query('user_Id') user_Id?: string,
  ) {
    try {
      const token = extractTokenFromHeader(authorization);
      const userId = decodeJwtToken(token, this.jwtService);
      const developerData = await this.userService.developerAssignToClient(
        userId,
        user_Id,
      );
      return response.status(HttpStatus.CREATED).json({
        message: Constants.developerAssignToClientSuccess,
        developerData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.developerAssignToClientError,
        error: err.message,
      });
    }
  }
}
