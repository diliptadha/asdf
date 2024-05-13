import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString } from 'class-validator';

export class AddEngineerDataDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  emailId: string;

  @ApiProperty()
  @IsNumber()
  phoneNo: number;

  @ApiProperty()
  @IsString()
  linkedInUrl: string;

  @ApiProperty()
  @IsString()
  resume: string;
}
