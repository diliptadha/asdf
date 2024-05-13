import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CommunityDto {
  // @IsString()
  // @ApiProperty()
  // userId: string;

  // @IsString()
  // @ApiProperty()
  // fullName: string;

  // @IsString()
  // @ApiProperty()
  // position: string;

  @IsString()
  @ApiProperty()
  description: string;

  // @IsString()
  // @ApiProperty()
  // profilePicture: string;
}
