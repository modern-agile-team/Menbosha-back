import { HttpStatus } from '@nestjs/common';
import { HttpException } from './http.exception';
import { HttpError } from '../type/exception.type';

export class HttpBadRequestException extends HttpException {
  constructor(error: HttpError<HttpBadRequestException>) {
    const { code } = error;
    super({ code, statusCode: HttpStatus.BAD_REQUEST });
  }

  getResponse(): HttpBadRequestException {
    return super.getResponse() as HttpBadRequestException;
  }
}
