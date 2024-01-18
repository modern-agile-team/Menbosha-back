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
        `${type} internal the ${data} must be a numeric string`,
      );
    }

    /**
     * 10진수 정수형으로 변환 후 return
     */
    return parseInt(value, 10);
  }
  /**
   * 1. string || number type인지 확인
   * 2. 정수 허용(소수 제외)
   * 3. Infinite, NaN 거기기
   * 4. 양의 정수인지 확인
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
