import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddClientMonthlyReviewDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  month: string;

  @ApiProperty()
  @IsString()
  review: string;
}
