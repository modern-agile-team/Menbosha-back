/* eslint-disable @typescript-eslint/no-unused-vars */
import { applyDecorators } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsNotEmptyObject,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

export function IsNotEmptyObjectAndAllFalse(
  options?: { nullable: boolean },
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string) {
    IsNotEmptyObject(options, validationOptions)(object, propertyName);
    registerDecorator({
      name: 'isNotEmptyObjectAndAllFalse',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return Object.values(value).some((value) => value);
        },
        defaultMessage(args: ValidationArguments) {
          return 'At least one property in $property should be true.';
        },
      },
    });
  };
}