import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { COMMON_ERROR_CODE } from 'src/constants/error/common/common-error-code.constant';
import { HttpInternalServerErrorException } from '../exceptions/http-internal-server-error.exception';
import { HttpExceptionService } from '../services/http-exception.service';

/**
 * 다른 exception filter 가 잡지않는 exception 을 잡는 필터
 * 내부적으로 만들어지지 않은 exception 을 사용했기때문에 server error 처리
 */
@Catch(HttpException)
export class HttpRemainderExceptionFilter
  implements ExceptionFilter<HttpException>
{
  constructor(private readonly httpExceptionService: HttpExceptionService) {}

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    const httpInternalServerErrorException =
      new HttpInternalServerErrorException({
        code: COMMON_ERROR_CODE.SERVER_ERROR,
        ctx: 'custom exception 을 사용하지 않아 생긴 에러',
        stack: exception.stack,
      });
    const exceptionError = httpInternalServerErrorException.getResponse();

    const responseJson = this.httpExceptionService.buildResponseJson(
      statusCode,
      exceptionError,
    );

    console.error(exceptionError.ctx);
    console.error(exceptionError.stack);

    response.status(statusCode).json(responseJson);
  }
}
