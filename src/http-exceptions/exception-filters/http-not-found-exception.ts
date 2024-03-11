import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { HttpNotFoundException } from '@src/http-exceptions/exceptions/http-not-found.exception';
import { HttpExceptionService } from '@src/http-exceptions/services/http-exception.service';
import { Response } from 'express';

@Catch(HttpNotFoundException)
export class HttpNotFoundExceptionFilter
  implements ExceptionFilter<HttpNotFoundException>
{
  constructor(private readonly httpExceptionService: HttpExceptionService) {}

  catch(exception: HttpNotFoundException, host: ArgumentsHost): void {
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
