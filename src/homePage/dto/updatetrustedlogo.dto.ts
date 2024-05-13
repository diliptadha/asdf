import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateTrustedByDto {
  @IsString()
  @ApiProperty()
  id: string;

  @IsString()
  @IsString()
  isVisible: string;
}
