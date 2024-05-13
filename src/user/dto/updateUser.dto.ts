import { ApiProperty } from '@nestjs/swagger';
import { currentStatus, typeOfEngagement, userRole } from '@prisma/client';
import { IsDate, IsEmail, IsNumber, IsString } from 'class-validator';
import { vettingResultEnum } from '@prisma/client';

class SocialLinksDto {
  @ApiProperty()
  facebook: string;

  @ApiProperty()
  linkedIn: string;

  @ApiProperty()
  twitter: string;
}

class vettingResultDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  userId?: string;

  @ApiProperty()
  @IsString()
  skill?: string;

  @ApiProperty()
  @IsString()
  vettingResult?: vettingResultEnum;

  @ApiProperty()
  @IsNumber()
  yearOfExperience?: number;
}

class educationDetailsDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  userId?: string;

  @ApiProperty()
  @IsString()
  course?: string;

  @ApiProperty()
  @IsString()
  university?: string;

  @ApiProperty()
  @IsString()
  department?: string;

  @ApiProperty()
  @IsDate()
  startDate?: Date;

  @ApiProperty()
  @IsDate()
  endDate?: Date;
}

class experienceDetailsDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  userId?: string;

  @ApiProperty()
  @IsString()
  companyName?: string;

  @ApiProperty()
  techstack?: string[];

  @ApiProperty()
  @IsString()
  responsibility?: string;

  @ApiProperty()
  @IsString()
  designation?: string;

  @ApiProperty()
  @IsDate()
  startDate?: Date;

  @ApiProperty()
  @IsDate()
  endDate?: Date;
}
export class UpdateUserDto {
  @ApiProperty()
  @IsString()
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
  emailId?: string;

  @ApiProperty()
  @IsString()
  password?: string;

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
  phoneNo?: number;

  @ApiProperty()
  @IsNumber()
  yearOfExperience?: number;

  @ApiProperty()
  @IsString()
  resume?: string;

  @ApiProperty()
  @IsString()
  typeOfEngagement?: typeOfEngagement;

  @ApiProperty()
  @IsString()
  currentStatus?: currentStatus;

  @ApiProperty()
  @IsString()
  noticePeriod?: string;

  @ApiProperty()
  @IsString()
  summary?: string;

  @ApiProperty()
  @IsString()
  socialLinks?: SocialLinksDto;

  @ApiProperty()
  userRole: userRole;

  @ApiProperty()
  @IsDate()
  hiredDate?: Date;

  @ApiProperty()
  vettingResults?: vettingResultDto[];

  @ApiProperty()
  educationDetails?: educationDetailsDto[];

  @ApiProperty()
  experienceDetails?: experienceDetailsDto[];

  @ApiProperty()
  @IsString()
  managerID?: string;

  @ApiProperty()
  @IsString()
  technicalInterviewNotes?: string;

  @ApiProperty()
  @IsString()
  softSkillAssessment?: string;

  @ApiProperty()
  @IsString()
  verifiedAiTools?: string[];
}
