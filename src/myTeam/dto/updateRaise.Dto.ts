import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class UpdateRaiseDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsNumber()
  raiseAmount?: number;

  @ApiProperty()
  @IsDate()
  effectiveOn?: Date;

  @ApiProperty()
  @IsNumber()
  currentRate?: number;

  @ApiProperty()
  @IsNumber()
  afterRaiseRate?: number;

  @ApiProperty()
  @IsString()
  messageRegardingRaise?: string;
}
