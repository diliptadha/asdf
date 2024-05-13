import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GiveFeedbackDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  message: string;

  @ApiProperty()
  @IsString()
  document: string;
}
