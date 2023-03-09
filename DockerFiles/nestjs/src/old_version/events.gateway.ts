import {
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	WsResponse,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
//import { from, Observable } from 'rxjs';
//import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { SocketGuard } from './socket.guard';


@WebSocketGateway(3631, {cors: true})

export class EventsGateway
{
	@WebSocketServer()
	server: Server;

	@UseGuards(SocketGuard)
	@SubscribeMessage('events')
	async identity(client: Socket, data: any): Promise<string>
	{
		if (data)
		{
			console.log(data, { depth: null});
			console.log("Data received : " + data.message);
		}
		client.emit("events", "test123");
		if (data)
			return (data.message);
		return ("prout");
		//this.server.sockets.emit('identity', data);
	}
}
