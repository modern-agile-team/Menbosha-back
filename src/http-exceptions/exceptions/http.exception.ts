import { HttpException as NestHttpException } from '@nestjs/common';
import { ErrorHttpStatusCode } from '@nestjs/common/utils/http-error-by-code.util';
import { HttpError } from '../type/exception.type';

export class HttpException extends NestHttpException {
  public readonly statusCode: ErrorHttpStatusCode;

  public readonly code: object;

  constructor(
    error: HttpError<HttpException> & { statusCode: ErrorHttpStatusCode },
  ) {
    const { statusCode, code } = error;

    super(
      {
        code,
      },
      statusCode,
    );
  }
}
