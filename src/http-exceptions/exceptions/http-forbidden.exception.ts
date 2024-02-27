import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@src/http-exceptions/exceptions/http.exception';
import { HttpError } from '@src/http-exceptions/type/exception.type';

export class HttpForbiddenException extends HttpException {
  constructor(error: HttpError<HttpForbiddenException>) {
    const { code } = error;
    super({ code, statusCode: HttpStatus.FORBIDDEN });
  }

  getResponse(): HttpForbiddenException {
    return super.getResponse() as HttpForbiddenException;
  }
}
