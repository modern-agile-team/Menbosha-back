import { HttpStatus } from '@nestjs/common';
import { HttpError } from '../type/exception.type';
import { HttpException } from './http.exception';

/**
 * customize status code 500 error exception
 */
export class HttpInternalServerErrorException extends HttpException {
  public readonly ctx: string;
  public readonly stack?: any;

  constructor(
    error: Omit<HttpError<HttpInternalServerErrorException>, 'message'> & {
      ctx: string;
      stack?: any;
    },
  ) {
    const { code, ctx } = error;

    super({
      code,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    });

    this.ctx = ctx;
    this.stack = this.stack;
  }

  getResponse(): HttpInternalServerErrorException {
    return {
      ...(super.getResponse() as any),
      ctx: this.ctx,
      stack: this.stack,
    } as HttpInternalServerErrorException;
  }
}
