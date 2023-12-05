import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { HttpExceptionService } from '../services/http-exception.service';
import { Response } from 'express';
import { HttpNotFoundException } from '../exceptions/http-not-found.exception';

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
