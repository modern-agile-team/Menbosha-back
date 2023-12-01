import { HttpStatus } from '@nestjs/common';
import { HttpException } from './http.exception';
import { HttpError } from '../type/exception.type';

export class HttpConflictException extends HttpException {
  constructor(error: HttpError<HttpConflictException>) {
    const { code } = error;
    super({ code, statusCode: HttpStatus.CONFLICT });
  }

  getResponse(): HttpConflictException {
    return super.getResponse() as HttpConflictException;
  }
}
