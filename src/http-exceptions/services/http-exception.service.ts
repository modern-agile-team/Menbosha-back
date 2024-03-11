import { Injectable } from '@nestjs/common';
import { ERROR_CODE } from '@src/constants/error/error-code.constant';
import { ERROR_MESSAGE } from '@src/constants/error/error-message.constant';
import { ExceptionResponseDto } from '@src/http-exceptions/dto/exception-response.dto';
import { ValueOf } from '@src/type/type';
import { config } from 'dotenv';

config();

export interface ExceptionError {
  code: ValueOf<typeof ERROR_CODE>;
  stack?: any;
  additionalResponse?: Record<string, any>;
}

@Injectable()
export class HttpExceptionService {
  buildResponseJson(
    statusCode: number,
    exceptionError: ExceptionError,
  ): ExceptionResponseDto {
    const code = exceptionError.code;

    return new ExceptionResponseDto({
      statusCode,
      code,
      message: ERROR_MESSAGE[code],
      stack:
        statusCode >= 500 && process.env.NODE_ENV
          ? exceptionError.stack
          : undefined,
      additionalResponse: exceptionError.additionalResponse,
    });
  }
}
