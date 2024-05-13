import { ApiProperty } from '@nestjs/swagger';
import { Json } from 'aws-sdk/clients/robomaker';
import { IsNumber, IsString, ValidateNested } from 'class-validator';

class experienceDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  companyName: string;

  @ApiProperty()
  @IsString()
  timePeriod: string;

  @ApiProperty()
  @IsString()
  techStack: string;

  @ApiProperty()
  @IsString()
  projectDescription: string;
}

class VettingResultDto {
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

export class AddRecommendationDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  designation: string;

  @ApiProperty()
  @IsString()
  workingHours: string;

  @ApiProperty()
  @IsString()
  workType: string;

  @ApiProperty()
  @IsString()
  location: string;

  @ApiProperty()
  @IsNumber()
  monthlySalary: number;

  @ApiProperty()
  @ValidateNested({ each: true })
  vettingResults: VettingResultDto[];

  @ApiProperty()
  @IsString()
  technicalInterviewNotes: string;

  @ApiProperty()
  @IsString()
  otherTechnicalSkills: string[];

  @ApiProperty()
  @IsString()
  softSkillAssessment: string;

  @ApiProperty()
  @IsString()
  verifiedAiTools: string[];

  @ApiProperty()
  about: Json;

  @ApiProperty()
  @ValidateNested({ each: true })
  experience: experienceDto[];
}
