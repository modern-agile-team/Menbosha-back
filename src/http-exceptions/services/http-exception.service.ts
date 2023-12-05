import { Injectable } from '@nestjs/common';
import { ERROR_CODE } from 'src/constants/error/error-code.constant';
import { ERROR_MESSAGE } from 'src/constants/error/error-message.constant';
import { ValueOf } from 'src/type/type';
import { ExceptionResponseDto } from '../dto/exception-response.dto';

interface ExceptionError {
  code: ValueOf<typeof ERROR_CODE>;
  stack?: any;
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
      stack: statusCode >= 500 && exceptionError.stack,
    });
  }
}
