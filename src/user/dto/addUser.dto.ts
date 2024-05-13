import { ApiProperty } from '@nestjs/swagger';
import { currentStatus, typeOfEngagement, userRole } from '@prisma/client';
import { IsEmail, IsNumber, IsString } from 'class-validator';

class SocialLinksDto {
  @ApiProperty()
  facebook: string;

  @ApiProperty()
  linkedIn: string;

  @ApiProperty()
  twitter: string;
}

export class AddUserDto {
  @IsString()
  @ApiProperty()
  userId: string;

  @ApiProperty()
  @IsString()
  firstName?: string;

  @ApiProperty()
  @IsString()
  lastName?: string;

  @ApiProperty()
  @IsNumber()
  age?: number;

  @ApiProperty()
  @IsString()
  designation?: string;

  @ApiProperty()
  techStack?: string[];

  @ApiProperty()
  @IsEmail()
  emailId: string;

  @ApiProperty()
  @IsEmail()
  password: string;

  @ApiProperty()
  @IsNumber()
  hourlyRate?: number;

  @ApiProperty()
  @IsString()
  country?: string;

  @ApiProperty()
  @IsString()
  address?: string;

  @ApiProperty()
  @IsNumber()
  phoneNo: number;

  @ApiProperty()
  @IsNumber()
  yearOfExperience?: number;

  @ApiProperty()
  @IsString()
  resume: string;

  @ApiProperty()
  typeOfEngagement?: typeOfEngagement;

  @ApiProperty()
  currentStatus?: currentStatus;

  @ApiProperty()
  @IsString()
  noticePeriod?: string;

  @ApiProperty()
  @IsString()
  summary?: string;

  @ApiProperty()
  @IsString()
  certificate?: string;

  @ApiProperty()
  @IsString()
  socialLinks: SocialLinksDto;

  @ApiProperty()
  userRole: userRole;
}
