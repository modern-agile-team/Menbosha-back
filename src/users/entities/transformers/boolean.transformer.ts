import { ValueTransformer } from 'typeorm';

/**
 * boolean transformer
 * TS에서 boolean 타입으로 true,false 혹은 1, 0을 사용한다.
 * 하지만 실제 DB에서는 tinyint 타입으로 1, 0으로만 저장이 된다.
 * 이를 통합 시키기 위해서 DB에서 받아오는 값은 !!를 통해 boolean값으로 명시적으로 변환
 * 반대로 DB에선 저장되는 값은 0, 1 값으로 저장
 */
export class BooleanTransformer implements ValueTransformer {
  public from(value?: number | null): boolean | undefined {
    return !!value;
  }

  public to(value?: boolean | null): number | undefined {
    return Number(value);
  }
}
