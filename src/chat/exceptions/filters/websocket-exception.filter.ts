import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { SocketException } from '../socket.exception';

@Catch(SocketException)
export class WebSocketExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.log(exception);
    const ackCallback = host.getArgByIndex(2);

    ackCallback(exception);
  }
}
