import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { HttpUnauthorizedException } from '@src/http-exceptions/exceptions/http-unauthorized.exception';
import { HttpExceptionService } from '@src/http-exceptions/services/http-exception.service';
import { Response } from 'express';

@Catch(HttpUnauthorizedException)
export class HttpUnauthorizedExceptionFilter
  implements ExceptionFilter<HttpUnauthorizedException>
{
  constructor(private readonly httpExceptionService: HttpExceptionService) {}

  catch(exception: HttpUnauthorizedException, host: ArgumentsHost): void {
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
