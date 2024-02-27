import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { HttpConflictException } from '@src/http-exceptions/exceptions/http-conflict.exception';
import { HttpExceptionService } from '@src/http-exceptions/services/http-exception.service';
import { Response } from 'express';

@Catch(HttpConflictException)
export class HttpConflictExceptionFilter
  implements ExceptionFilter<HttpConflictException>
{
  constructor(private readonly httpExceptionService: HttpExceptionService) {}

  catch(exception: HttpConflictException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const statusCode = exception.getStatus();
    const exceptionError = exception.getResponse();

    const responseJson = this.httpExceptionService.buildResponseJson(
      statusCode,
      exceptionError,
    );

    response.status(statusCode).json(responseJson);
  }
}
