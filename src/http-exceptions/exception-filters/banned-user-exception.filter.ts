import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { BannedUserException } from '@src/http-exceptions/exceptions/banned-user.exception';
import {
  ExceptionError,
  HttpExceptionService,
} from '@src/http-exceptions/services/http-exception.service';
import { Response } from 'express';

@Catch(BannedUserException)
export class BannedUserExceptionFilter
  implements ExceptionFilter<BannedUserException>
{
  constructor(private readonly httpExceptionService: HttpExceptionService) {}

  catch(exception: BannedUserException, host: ArgumentsHost): void {
    console.log('catch');
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const statusCode = exception.getStatus();
    const exceptionError = exception.getResponse();

    const responseJson = this.httpExceptionService.buildResponseJson(
      statusCode,
      exceptionError as ExceptionError,
    );

    response.status(statusCode).json(responseJson);
  }
}
