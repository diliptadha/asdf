import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class addCertificateDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  certificate: string;

  @IsString()
  @ApiProperty()
  emailId: string;

  @IsString()
  @ApiProperty()
  phoneNo: string;

  @IsString()
  @ApiProperty()
  resume: string;

  @IsString()
  @ApiProperty()
  linkedinUrl: string;
}
