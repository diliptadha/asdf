import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class AddRequestForPointsDto {
  @IsString()
  @ApiProperty()
  userId: string;

  @IsNumber()
  @ApiProperty()
  points: number;
}
