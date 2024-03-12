import { Injectable } from '@nestjs/common';
import { ERROR_CODE } from '@src/constants/error/error-code.constant';
import { ERROR_MESSAGE } from '@src/constants/error/error-message.constant';
import { AppConfigService } from '@src/core/app-config/services/app-config.service';
import { ExceptionResponseDto } from '@src/http-exceptions/dto/exception-response.dto';
import { ValueOf } from '@src/type/type';

export interface ExceptionError {
  code: ValueOf<typeof ERROR_CODE>;
  stack?: any;
  additionalResponse?: Record<string, any>;
}

@Injectable()
export class HttpExceptionService {
  constructor(private readonly appConfigService: AppConfigService) {}

  buildResponseJson(
    statusCode: number,
    exceptionError: ExceptionError,
  ): ExceptionResponseDto {
    const isProduction = this.appConfigService.isProduction();
    const code = exceptionError.code;

    return new ExceptionResponseDto({
      statusCode,
      code,
      message: ERROR_MESSAGE[code],
      stack:
        statusCode >= 500 && isProduction ? exceptionError.stack : undefined,
      additionalResponse: exceptionError.additionalResponse,
    });
  }
}
