import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';

import { currentStatus } from '@prisma/client';

export class FilterDTO {
  @IsArray()
  technicalSkill: string[];

  @IsBoolean()
  considerVettedSkill: boolean;

  @IsString()
  softSkills: string;

  @IsString()
  city: string;

  @IsString()
  country: string;

  @IsString()
  availability: currentStatus;

  @IsNumber()
  pricePerHour: number;
}
