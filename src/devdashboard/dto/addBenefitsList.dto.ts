import { ApiProperty } from '@nestjs/swagger';
import { IsString, ValidateNested } from 'class-validator';

export class AddBenefitListDto {
  @ApiProperty()
  @IsString()
  icon: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @ValidateNested({ each: true })
  @IsString()
  benefitQuestion: benefitQuestion[];
}

export class benefitQuestion {
  @ApiProperty()
  @IsString()
  question: string;
}
