import { HttpStatus } from '@nestjs/common';
import { HttpException } from './http.exception';
import { HttpError } from '../type/exception.type';

export class HttpForbiddenException extends HttpException {
  constructor(error: HttpError<HttpForbiddenException>) {
    const { code } = error;
    super({ code, statusCode: HttpStatus.FORBIDDEN });
  }

  getResponse(): HttpForbiddenException {
    return super.getResponse() as HttpForbiddenException;
  }
}
