import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ClientReviewDto {
  @ApiProperty()
  @IsString()
  message: string;
}
