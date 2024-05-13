import { ApiProperty } from '@nestjs/swagger';
import { workType } from '@prisma/client';
import { DateTime } from 'aws-sdk/clients/devicefarm';
import { IsDate, IsNumber, IsString, ValidateNested } from 'class-validator';

class WeeklySummariesDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsNumber()
  workingTime: number;

  @ApiProperty()
  @IsDate()
  date: Date;
}

class OverviewDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsNumber()
  workingHoursInDay: number;

  @ApiProperty()
  workType: workType;

  @ApiProperty()
  @IsNumber()
  monthlySalary: number;

  @ApiProperty()
  @IsNumber()
  bonusGiven: number;

  weeklySummaries: WeeklySummariesDto;
}
class BonusHistoryDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  developer: string;

  @ApiProperty()
  @IsString()
  role: string;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsDate()
  sentOn: Date;
}

class RaiseHistoryDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  developer: string;

  @ApiProperty()
  @IsString()
  role: string;

  @ApiProperty()
  @IsNumber()
  raise: number;

  @ApiProperty()
  @IsDate()
  effectiveOn: DateTime;
}

class BenefitsDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  benefitList: string[];
}

class hiredVettingResultDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  skill: string;

  @ApiProperty()
  @IsString()
  vettingResult: string;

  @ApiProperty()
  @IsNumber()
  yearOfExperience: number;
}

class hiredSettingDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  timeTraker: string;

  @ApiProperty()
  @IsString()
  weeklySummaries: string;
}

export class AddHiredTeamDto {
  @IsString()
  @ApiProperty()
  userId: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  designation: string;

  @ApiProperty()
  @IsString()
  location: string;

  @ApiProperty()
  @IsNumber()
  rate: number;

  @ApiProperty()
  overview: OverviewDto;

  @ApiProperty()
  bonusHistory: BonusHistoryDto;

  @ApiProperty()
  raiseHistory: RaiseHistoryDto;

  @ApiProperty()
  benefits: BenefitsDto;

  @ApiProperty()
  @ValidateNested({ each: true })
  vettingResults: hiredVettingResultDto[];

  @ApiProperty()
  hiredSettings: hiredSettingDto;
}
