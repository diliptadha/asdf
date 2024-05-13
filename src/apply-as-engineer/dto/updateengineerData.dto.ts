import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class UpdateEngineerDataDto {
  @ApiProperty()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsEmail()
  emailId?: string;

  @ApiProperty()
  @IsString()
  phoneNo?: string;

  @ApiProperty()
  @IsString()
  linkedInUrl?: string;

  @ApiProperty()
  @IsString()
  resume?: string[];
}
