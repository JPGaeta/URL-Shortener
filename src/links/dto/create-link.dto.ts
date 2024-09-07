import { ApiProperty } from '@nestjs/swagger';

export class CreateLinkDto {
  @ApiProperty({ required: true })
  url: string;
}
