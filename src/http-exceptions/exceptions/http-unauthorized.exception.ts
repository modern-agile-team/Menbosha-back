import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@src/http-exceptions/exceptions/http.exception';
import { HttpError } from '@src/http-exceptions/type/exception.type';

export class HttpUnauthorizedException extends HttpException {
  constructor(error: HttpError<HttpUnauthorizedException>) {
    const { code } = error;
    super({ code, statusCode: HttpStatus.UNAUTHORIZED });
  }

  getResponse(): HttpUnauthorizedException {
    return super.getResponse() as HttpUnauthorizedException;
  }
}
