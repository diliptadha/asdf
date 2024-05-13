import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class AddPaymentDto {
  @IsString()
  @ApiProperty()
  userId: string;

  @IsNumber()
  @ApiProperty()
  amount: number;

  @IsDate()
  @ApiProperty()
  @IsOptional()
  date?: Date;

  @IsString()
  @ApiProperty()
  paymentSlip: string;
}
