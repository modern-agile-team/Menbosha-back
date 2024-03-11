import { ExposeOptions, Transform } from 'class-transformer';

export function TransformMongoId(options?: ExposeOptions) {
  return (target: any, propertyKey: string) => {
    Transform((params) => params.obj[propertyKey]?.toString(), options)(
      target,
      propertyKey,
    );
  };
}
