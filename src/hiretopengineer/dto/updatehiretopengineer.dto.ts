import { ApiProperty } from '@nestjs/swagger';
import { workType } from '@prisma/client';
import { IsEmail, IsString } from 'class-validator';

export class UpdateHireTopEngineerDto {
  @ApiProperty()
  workType?: workType;

  @ApiProperty()
  @IsString()
  skill?: string[];

  @ApiProperty()
  @IsString()
  noOfSoftEngineer?: string;

  @ApiProperty()
  @IsString()
  firstName?: string;

  @ApiProperty()
  @IsString()
  lastName?: string;

  @ApiProperty()
  @IsEmail()
  companyEmail?: string;

  @ApiProperty()
  @IsString()
  noOfEmployee?: string;

  @ApiProperty()
  @IsString()
  message?: string;

  @ApiProperty()
  @IsString()
  findUs?: string[];
}
