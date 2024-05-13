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
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiSecurity, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Constants, endpoints } from 'src/utils/constants';
import { ApplyAsEngineerService } from './applyasengineer.service';
import { Response } from 'express';
import { AddEngineerDataDto } from './dto/addengineerData.dto';
import { UpdateEngineerDataDto } from './dto/updateengineerData.dto';

@ApiTags(endpoints.applyAsEngineer)
@Controller(endpoints.applyAsEngineer)
export class ApplyAsEngineerController {
  constructor(private applyAsEngineerService: ApplyAsEngineerService) {}

  @Post(endpoints.addData)
  @UseInterceptors(FilesInterceptor(Constants.files))
  async addEngineerData(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() addEngineerDataDto: AddEngineerDataDto,
    @Body() updateEngineerDataDto: UpdateEngineerDataDto,
    @Res() response: Response,
  ) {
    try {
      const engineerData = await this.applyAsEngineerService.addEngineerData(
        addEngineerDataDto,
        updateEngineerDataDto,
        files,
      );
      return response.status(HttpStatus.CREATED).json({
        message: Constants.addEngineerDataSuccess,
        engineerData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.addEngineerDataError,
        error: err.message,
      });
    }
  }

  @Get(endpoints.getData)
  @ApiQuery({ name: 'id', required: false })
  @ApiSecurity('JWT-auth')
  async getEngineerData(@Res() response: Response, @Query('id') id?: string) {
    try {
      const engineerData =
        await this.applyAsEngineerService.getEngineerData(id);
      return response.status(HttpStatus.CREATED).json({
        message: Constants.getEngineerDataSuccess,
        engineerData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.getEngineerDataError,
        error: err.message,
      });
    }
  }

  @Post(endpoints.deleteData)
  @ApiQuery({ name: 'id', required: false })
  @ApiSecurity('JWT-auth')
  async deleteEngineerData(
    @Res() response: Response,
    @Query('id') id?: string,
  ) {
    try {
      const engineerData =
        await this.applyAsEngineerService.deleteEngineerData(id);
      return response.status(HttpStatus.CREATED).json({
        message: Constants.deleteEngineerDataSuccess,
        engineerData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.deleteEngineerDataError,
        error: err.message,
      });
    }
  }
}
