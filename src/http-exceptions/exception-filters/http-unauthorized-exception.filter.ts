import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { HttpExceptionService } from '../services/http-exception.service';
import { Response } from 'express';
import { HttpUnauthorizedException } from '../exceptions/http-unauthorized.exception';

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
