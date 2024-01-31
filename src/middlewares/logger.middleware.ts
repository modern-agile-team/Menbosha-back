import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';
    const startTime = new Date().getTime();

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      const endTime = new Date().getTime();
      const duration = `${endTime - startTime}ms`;

      this.logger.log({
        duration,
        method,
        originalUrl,
        statusCode,
        contentLength,
        userAgent,
        ip,
      });
    });

    next();
  }
}
