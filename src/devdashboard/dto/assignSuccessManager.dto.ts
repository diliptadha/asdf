import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AssignSuccessManagerDto {
  @IsString()
  @ApiProperty()
  userId: string;
}
