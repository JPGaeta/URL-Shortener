import { ApiProperty } from '@nestjs/swagger';

export class CreateLinkDto {
  @ApiProperty({ required: true, description: 'The URL to be shortened' })
  url: string;
}
