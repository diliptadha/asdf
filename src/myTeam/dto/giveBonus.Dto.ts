import { ApiProperty } from '@nestjs/swagger';
import { Datetime } from 'aws-sdk/clients/costoptimizationhub';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class GiveBonusDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsNumber()
  bonusAmount: number;

  @ApiProperty()
  @IsDate()
  date: Datetime;
}
