import { ApiProperty } from '@nestjs/swagger';
import { CreateLinkDto } from './create-link.dto';
import { IsUUID } from 'class-validator';

export class UpdateLinkDto extends CreateLinkDto {}

export class UpdateLinkParamsDto {
  @ApiProperty({ required: true })
  @IsUUID('7')
  id: string;
}
