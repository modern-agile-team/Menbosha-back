import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { HttpInternalServerErrorException } from '../exceptions/http-internal-server-error.exception';
import { HttpExceptionService } from '../services/http-exception.service';

/**
 * nestJS 메서드를 이용한 500번 에러 를 잡는 exception filter
 * ex) throw new InternalServerErrorException()
 */
@Catch(HttpInternalServerErrorException)
export class HttpInternalServerErrorExceptionFilter
  implements ExceptionFilter<HttpInternalServerErrorException>
{
  constructor(private readonly httpExceptionService: HttpExceptionService) {}

  catch(
    exception: HttpInternalServerErrorException,
    host: ArgumentsHost,
  ): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const statusCode = exception.getStatus();
    const exceptionError = exception.getResponse();

    const responseJson = this.httpExceptionService.buildResponseJson(
      statusCode,
      exceptionError,
    );

    console.error(exception.ctx);
    console.error(exception.stack);

    response.status(statusCode).json(responseJson);
  }
}
