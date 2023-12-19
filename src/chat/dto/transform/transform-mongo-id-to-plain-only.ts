import { Transform } from 'class-transformer';

export function TransformMongoIdToPlainOnly() {
  return Transform(({ value }) => value.map((item) => item.toString()), {
    toPlainOnly: true,
  });
}
