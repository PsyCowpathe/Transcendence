import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';

@WebSocketGateway(3631, {cors: true})

export class EventsGateway {
  @WebSocketServer()
  server: Server;

//identify(client: Socket, data: any)
  @SubscribeMessage('events')
  async identity(@MessageBody() data: number): Promise<number>
	{
		//this.server.sockets.emit('identity', data);
	console.log("succeeess!!!");
    return (data);
  }
}
