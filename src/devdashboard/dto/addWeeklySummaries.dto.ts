import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class WeeklySummariesDto {
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
