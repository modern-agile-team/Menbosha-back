import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';

@Catch()
export class WebSocketExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const client = ctx.getClient();

    client.emit('error', exception.response || { exception });

    console.error(exception.message, exception);
  }
}
