import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@src/http-exceptions/exceptions/http.exception';
import { HttpError } from '@src/http-exceptions/type/exception.type';

export class AdminException extends HttpException {
  constructor(error: HttpError<AdminException>) {
    const { code } = error;
    super({ code, statusCode: HttpStatus.FORBIDDEN });
  }

  getResponse(): AdminException {
    return super.getResponse() as AdminException;
  }
}
