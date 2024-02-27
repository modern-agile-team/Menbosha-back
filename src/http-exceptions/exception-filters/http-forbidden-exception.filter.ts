import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { HttpForbiddenException } from '@src/http-exceptions/exceptions/http-forbidden.exception';
import { HttpExceptionService } from '@src/http-exceptions/services/http-exception.service';
import { Response } from 'express';

@Catch(HttpForbiddenException)
export class HttpForbiddenExceptionFilter
  implements ExceptionFilter<HttpForbiddenException>
{
  constructor(private readonly httpExceptionService: HttpExceptionService) {}

  catch(exception: HttpForbiddenException, host: ArgumentsHost): void {
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
