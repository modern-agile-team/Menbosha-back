import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@src/http-exceptions/exceptions/http.exception';
import { HttpError } from '@src/http-exceptions/type/exception.type';

export class HttpNotFoundException extends HttpException {
  constructor(error: HttpError<HttpNotFoundException>) {
    const { code } = error;
    super({ code, statusCode: HttpStatus.NOT_FOUND });
  }

  getResponse(): HttpNotFoundException {
    return super.getResponse() as HttpNotFoundException;
  }
}
