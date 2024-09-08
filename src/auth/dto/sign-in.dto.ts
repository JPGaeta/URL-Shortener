import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @ApiProperty({ required: true, description: 'The user email' })
  email: string;

  @MinLength(6)
  @ApiProperty({ required: true, description: 'The user password' })
  password: string;
}
