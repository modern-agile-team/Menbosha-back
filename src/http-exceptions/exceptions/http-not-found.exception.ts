import { HttpStatus } from '@nestjs/common';
import { HttpException } from './http.exception';
import { HttpError } from '../type/exception.type';

export class HttpNotFoundException extends HttpException {
  constructor(error: HttpError<HttpNotFoundException>) {
    const { code } = error;
    super({ code, statusCode: HttpStatus.NOT_FOUND });
  }

  getResponse(): HttpNotFoundException {
    return super.getResponse() as HttpNotFoundException;
  }
}
