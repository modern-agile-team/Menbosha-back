import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export class ParsePositiveIntPipe implements PipeTransform<string> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const { type, data } = metadata;

    if (!this.isPositiveNumeric(value)) {
      throw new BadRequestException(
        `${type} internal the ${data} must be a numeric string`,
      );
    }

    return parseInt(value, 10);
  }
  private isPositiveNumeric(value: string): boolean {
    return (
      ['string', 'number'].includes(typeof value) &&
      /^-?\d+$/.test(value) &&
      isFinite(value as any) &&
      Number(value) >= 1
    );
  }
}
