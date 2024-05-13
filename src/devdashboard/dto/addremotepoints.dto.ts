import { ApiProperty } from '@nestjs/swagger';
import { pointsType } from '@prisma/client';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class AddRemotePointsDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsNumber()
  points: number;

  @ApiProperty()
  @IsString()
  pointsType: pointsType;

  @ApiProperty()
  @IsDate()
  date: Date;

  @ApiProperty()
  @IsString()
  notes: string;
}
