import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@src/http-exceptions/exceptions/http.exception';
import { HttpError } from '@src/http-exceptions/type/exception.type';

export class HttpBadRequestException extends HttpException {
  constructor(error: HttpError<HttpBadRequestException>) {
    const { code } = error;
    super({ code, statusCode: HttpStatus.BAD_REQUEST });
  }

  getResponse(): HttpBadRequestException {
    return super.getResponse() as HttpBadRequestException;
  }
}
