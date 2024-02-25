import { optionalBooleanMapper } from '@src/common/constants/optional-boolean-mapper';
import { Transform } from 'class-transformer';

export const ParseOptionalBoolean = (): PropertyDecorator =>
  Transform(({ value }) => optionalBooleanMapper.get(value));
