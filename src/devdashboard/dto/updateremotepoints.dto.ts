import { ApiProperty } from '@nestjs/swagger';
import { pointsType } from '@prisma/client';
import { IsNumber, IsString } from 'class-validator';

export class UpdateRemotePointsDto {
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
  @IsString()
  date: Date;

  @ApiProperty()
  @IsString()
  notes: string;
}
