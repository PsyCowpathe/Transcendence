import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import { SocketGuard } from '../guard/socket.guard';


@WebSocketGateway(3631, {cors: true})

export class WsRelationGateway
{
	@WebSocketServer()
	server: Server;

	@UseGuards(SocketGuard)
	@SubscribeMessage('events')
	async identity(client: Socket, data: any): Promise<string>
	{
		console.log("EVENTS");
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

