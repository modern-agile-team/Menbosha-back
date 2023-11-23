import { BadRequestException } from '@nestjs/common';
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string> {
  async transform(value: string, metadata: ArgumentMetadata) {
    if (!value.match('^[a-fA-F0-9]{24}$')) {
      throw new BadRequestException('올바른 ObjectId 형식이 아닙니다.');
    }
    return value;
  }
}
