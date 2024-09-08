import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: true })
class IsHttpsConstraint implements ValidatorConstraintInterface {
  validate(url: string) {
    return url.startsWith('https://');
  }

  defaultMessage() {
    return 'url must start with https://';
  }
}

export function IsHttps(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsHttpsConstraint,
    });
  };
}

export class CreateLinkDto {
  @IsNotEmpty()
  @IsHttps()
  @IsUrl()
  @ApiProperty({ required: true, description: 'The URL to be shortened' })
  url: string;
}
