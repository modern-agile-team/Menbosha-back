import { Transform } from 'class-transformer';
import { optionalBooleanMapper } from '../constants/optional-boolean-mapper';

export const ParseOptionalBoolean = (): PropertyDecorator =>
  Transform(({ value }) => optionalBooleanMapper.get(value));
