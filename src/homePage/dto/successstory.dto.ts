import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SuccessStoryDto {
  @ApiProperty()
  @IsString()
  successStory: string;
}
