import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddDocumentDto {
  @IsString()
  @ApiProperty()
  userId?: string;

  @IsString()
  @ApiProperty()
  document: string;
}
