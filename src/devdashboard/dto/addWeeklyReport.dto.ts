import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class AddWeeklyReportDto {
  @IsString()
  @ApiProperty()
  userId: string;

  @IsDate()
  @ApiProperty()
  startDate: Date;

  @IsDate()
  @ApiProperty()
  endDate: Date;

  @IsNumber()
  @ApiProperty()
  workingHours: number;

  @IsString()
  @ApiProperty()
  summary: string;
}
