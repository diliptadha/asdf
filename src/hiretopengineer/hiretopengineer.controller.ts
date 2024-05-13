import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { HiretopengineerService } from './hiretopengineer.service';
import { Constants, endpoints } from 'src/utils/constants';
import { ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AddHireTopEngineerDto } from './dto/addhiretopengineer.dto';
import { Response } from 'express';

@ApiTags(endpoints.hiretopengineer)
@Controller(endpoints.hiretopengineer)
export class HiretopengineerController {
  constructor(private hiretopengineerService: HiretopengineerService) {}

  @Post(endpoints.addHireData)
  @ApiQuery({ name: 'userId', required: false })
  async addhireEngineerData(
    @Res() response: Response,
    @Body() addHireTopEngineerDto: AddHireTopEngineerDto,
    @Query('userId') userId?: string,
  ) {
    try {
      const hireEngineerData =
        await this.hiretopengineerService.addhireEngineerData(
          addHireTopEngineerDto,
          userId,
        );
      return response.status(HttpStatus.CREATED).json({
        message: Constants.addHireEngineerDataSuccess,
        hireEngineerData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.addHireEngineerDataError,
        error: err.message,
      });
    }
  }

  @Get(endpoints.getHireData)
  @ApiSecurity('JWT-auth')
  @ApiQuery({ name: 'id', required: false })
  async gethireEngineerData(
    @Res() response: Response,
    @Query('id') id?: string,
  ) {
    try {
      const hireEngineerData =
        await this.hiretopengineerService.gethireEngineerData(id);
      return response.status(HttpStatus.CREATED).json({
        message: Constants.getHireEngineerDataSuccess,
        hireEngineerData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.getHireEngineerDataError,
        error: err.message,
      });
    }
  }

  @Post(endpoints.deleteHireData)
  @ApiSecurity('JWT-auth')
  @ApiQuery({ name: 'id', required: false })
  async deletehireEngineerData(
    @Res() response: Response,
    @Query('id') id?: string,
  ) {
    try {
      const hireEngineerData =
        await this.hiretopengineerService.deletehireEngineerData(id);
      return response.status(HttpStatus.CREATED).json({
        message: Constants.deleteHireEngineerDataSuccess,
        hireEngineerData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: Constants.deleteHireEngineerDataError,
        error: err.message,
      });
    }
  }
}
