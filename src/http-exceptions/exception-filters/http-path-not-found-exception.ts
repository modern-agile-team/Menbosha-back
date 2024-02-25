import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { HttpExceptionService } from '@src/http-exceptions/services/http-exception.service';

@Catch(NotFoundException)
export class HttpPathNotFoundExceptionFilter
  implements ExceptionFilter<NotFoundException>
{
  constructor(private readonly httpExceptionService: HttpExceptionService) {}

  catch(exception: NotFoundException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const statusCode = exception.getStatus();
    const exceptionError = {
      code: COMMON_ERROR_CODE.API_NOT_FOUND,
    };

    const responseJson = this.httpExceptionService.buildResponseJson(
      statusCode,
      exceptionError,
    );

    response.status(statusCode).json(responseJson);
  }
}
