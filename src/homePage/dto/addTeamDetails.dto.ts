import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

class SocialLinksDto {
  @ApiProperty()
  facebook: string;

  @ApiProperty()
  linkedIn: string;

  @ApiProperty()
  twitter: string;
}

export class AddTeamDetailsDto {
  @IsString()
  @ApiProperty()
  fullName: string;

  @IsString()
  @ApiProperty()
  position: string;

  @IsString()
  @ApiProperty()
  role: string;

  @IsString()
  @ApiProperty()
  profilePicture: string;

  @ApiProperty()
  @IsString()
  socialLinks: SocialLinksDto;
}
