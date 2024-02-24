import { HttpStatus } from '@nestjs/common';
import { ErrorHttpStatusCode } from '@nestjs/common/utils/http-error-by-code.util';
import { ERROR_CODE } from '@src/constants/error/error-code.constant';

/**
 * node  process error exception
 * ex) ReferenceError, TypeError etc
 * {@link https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Error}
 */
export class HttpProcessErrorException {
  public readonly code: (typeof ERROR_CODE)[keyof typeof ERROR_CODE];

  public readonly statusCode: ErrorHttpStatusCode;

  constructor(error: Pick<HttpProcessErrorException, 'code'>) {
    const { code } = error;

    this.code = code;
    this.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  }

  getResponse(): HttpProcessErrorException {
    return this;
  }
}
