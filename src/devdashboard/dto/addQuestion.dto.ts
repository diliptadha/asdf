import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddRequestedBenefitsDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  questionId: string;

  @ApiProperty()
  @IsString()
  answer: string;

  @ApiProperty()
  @IsString()
  benefitsListId: string;
}
