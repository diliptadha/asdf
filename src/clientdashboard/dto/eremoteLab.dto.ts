import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class EremoteLabsDto {
  @ApiProperty()
  @IsString()
  projectType: string;

  @ApiProperty()
  @IsString()
  projectBudget: string;

  @ApiProperty()
  @IsString()
  projectDescription: string;

  @ApiProperty()
  @IsString()
  projectDocument: string;
}
