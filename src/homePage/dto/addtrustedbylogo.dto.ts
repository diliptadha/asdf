import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddTrustedByDto {
  @IsString()
  @ApiProperty()
  logo: string;

  @IsString()
  @ApiProperty()
  isVisible: string;
}
