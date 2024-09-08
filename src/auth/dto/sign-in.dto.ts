import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({ required: true, description: 'The user email' })
  email: string;

  @ApiProperty({ required: true, description: 'The user password' })
  password: string;
}
