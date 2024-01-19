import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

/**
 * 양의 정수인지 확인하고 맞다면 Number 타입으로 변환
 * 아니라면 에러
 */
export class ParsePositiveIntPipe implements PipeTransform<string> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const { type, data } = metadata;

    if (!this.isPositiveNumeric(value)) {
      throw new BadRequestException(
        `${type} internal the ${data} must be a positive integer string`,
      );
    }

    /**
     * 10진수 정수형으로 변환한 값을 return
     */
    return parseInt(value, 10);
  }
  /**
   * 1. string || number type인지 확인
   * 2. 정수인지 확인
   * 3. Infinite, NaN 거르기
   * 4. 최소 1의 양의 유리수인지 확인
   */
  private isPositiveNumeric(value: string): boolean {
    return (
      ['string', 'number'].includes(typeof value) &&
      /^-?\d+$/.test(value) &&
      isFinite(value as any) &&
      Number(value) >= 1
    );
  }
}
