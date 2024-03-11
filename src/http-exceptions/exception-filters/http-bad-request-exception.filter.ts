import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { HttpBadRequestException } from '@src/http-exceptions/exceptions/http-bad-request.exception';
import { HttpExceptionService } from '@src/http-exceptions/services/http-exception.service';
import { Response } from 'express';

@Catch(HttpBadRequestException)
export class HttpBadRequestExceptionFilter
  implements ExceptionFilter<HttpBadRequestException>
{
  constructor(private readonly httpExceptionService: HttpExceptionService) {}

  catch(exception: HttpBadRequestException, host: ArgumentsHost): void {
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
