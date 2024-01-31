import { applyDecorators } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsInt, Min, ValidationOptions } from 'class-validator';

/**
 * 양의 정수만 허용 및 number로 타입 변환
 * Number로 타입 변환 -> 정수인지 확인 -> 1 이상인지 확인
 */
export const IsPositiveInt = (
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return applyDecorators(
    Type(() => Number),
    IsInt(validationOptions),
    Min(1, validationOptions),
  );
};
