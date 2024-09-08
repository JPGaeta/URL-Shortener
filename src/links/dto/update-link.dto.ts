import { CreateLinkDto } from './create-link.dto';
import { IsUUID } from 'class-validator';

export class UpdateLinkDto extends CreateLinkDto {}

export class UpdateLinkParamsDto {
  @IsUUID('7')
  id: string;
}
