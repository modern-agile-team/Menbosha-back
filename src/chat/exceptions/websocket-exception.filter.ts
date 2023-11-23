import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';

@Catch()
export class WebSocketExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const args = host.getArgs();
    // event ack callback
    if ('function' === typeof args[args.length - 1]) {
      const ACKCallback = args.pop();
      ACKCallback({ error: exception.message, exception });
      console.error(exception.message, exception);
    }
  }
}
