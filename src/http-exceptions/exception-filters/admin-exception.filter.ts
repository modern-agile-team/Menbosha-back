import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { AdminException } from 'src/http-exceptions/exceptions/admin-exception';
import { HttpExceptionService } from 'src/http-exceptions/services/http-exception.service';

@Catch(AdminException)
export class AdminExceptionFilter implements ExceptionFilter<AdminException> {
  constructor(private readonly httpExceptionService: HttpExceptionService) {}

  catch(exception: AdminException, host: ArgumentsHost): void {
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
