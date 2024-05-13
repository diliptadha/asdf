import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty()
  emailId: string;

  @ApiProperty()
  OTP: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  confirmPassword: string;
}
