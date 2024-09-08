import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class CreateLinkDto {
  @IsNotEmpty()
  @IsUrl()
  @ApiProperty({ required: true, description: 'The URL to be shortened' })
  url: string;
}
