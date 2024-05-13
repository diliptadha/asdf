import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddFAQDto {
  @ApiProperty()
  @IsString()
  question: string;

  @ApiProperty()
  @IsString()
  answer: string;

  @ApiProperty()
  @IsString()
  pageName: string;
}
