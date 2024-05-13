import { ApiProperty } from '@nestjs/swagger';
import { workType } from '@prisma/client';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class AddHireTopEngineerDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  workType: workType;

  @ApiProperty()
  @IsOptional()
  skill?: string[];

  @ApiProperty()
  @IsString()
  noOfSoftEngineer: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsEmail()
  companyEmail: string;

  @ApiProperty()
  @IsString()
  noOfEmployee: string;

  @ApiProperty()
  @IsString()
  message: string;

  @ApiProperty()
  @IsOptional()
  findUs: string[];
}
