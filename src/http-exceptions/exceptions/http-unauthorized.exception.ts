import { HttpStatus } from '@nestjs/common';
import { HttpException } from './http.exception';
import { HttpError } from '../type/exception.type';

export class HttpUnauthorizedException extends HttpException {
  constructor(error: HttpError<HttpUnauthorizedException>) {
    const { code } = error;
    super({ code, statusCode: HttpStatus.UNAUTHORIZED });
  }

  getResponse(): HttpUnauthorizedException {
    return super.getResponse() as HttpUnauthorizedException;
  }
}
