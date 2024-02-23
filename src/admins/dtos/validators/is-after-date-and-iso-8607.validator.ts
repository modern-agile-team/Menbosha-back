import {
  Matches,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { ISO_8601_REGEXP } from 'src/common/constants/ISO-8601.regexp';

export const IsAfterDateAndISO8601 = (
  validationOptions?: ValidationOptions,
) => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    Matches(ISO_8601_REGEXP, validationOptions)(object, propertyName);
    registerDecorator({
      name: 'isAfterDateAndISO8601',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return new Date(args.object[propertyName]) > new Date();
        },

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        defaultMessage(_args: ValidationArguments) {
          return '$property must be a future time compared to the current time.';
        },
      },
    });
  };
};
