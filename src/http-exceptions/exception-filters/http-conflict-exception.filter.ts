import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { HttpExceptionService } from '../services/http-exception.service';
import { Response } from 'express';
import { HttpConflictException } from '../exceptions/http-conflict.exception';

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
