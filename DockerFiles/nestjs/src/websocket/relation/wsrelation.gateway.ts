import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import { SocketGuard } from '../guard/socket.guard';

import { sendError, sendSuccess } from '../../common/response';
import { errorMessages } from '../../common/global'; 

import { WsRelationService } from './wsrelation.service';

@WebSocketGateway(3631, {cors: true}) //namespace relation

export class WsRelationGateway
{
	constructor(private readonly wsRelationService: WsRelationService)
	{

	}

	@WebSocketServer()
	server: Server;

	@UseGuards(SocketGuard)
	@SubscribeMessage('newlink')
	createLink(client: Socket)
	{
		console.log("Newlink requested !");
		let clientToken = client.handshake.auth.token;
		this.wsRelationService.saveRelationSocket(client, clientToken);
	}

	@UseGuards(SocketGuard)
	@SubscribeMessage('sendfriendrequest')
	async sendFriendRequest(client: Socket, data: any)
	{
		console.log("New request to user : ")
		console.log(data.name);
		if (data.name === undefined)
		{
			client.emit("sendfriendrequest", errorMessages.MISSINGNAME);
			return ;
		}
		let sender : number | undefined;
		if ((sender = this.wsRelationService.isRegistered(client)) === undefined)
		{
			client.emit("sendfriendrequest", errorMessages.NOTREGISTERED);
			return ;
		}
		let ret = await this.wsRelationService.sendFriendRequest(sender, data.name);
		if (ret === -1)
		{
			client.emit("sendfriendrequest", errorMessages.INVALIDNAME);
			return ;
		}
		if (ret === -2)
		{
			client.emit("sendfriendrequest", errorMessages.YOUAREIGNORED);
			return ;
		}
		if (ret === -3)
		{
			client.emit("sendfriendrequest", errorMessages.ALREADYFRIEND);
			return ;
		}
		client.emit("sendfriendrequest", `Request successfully send to ${data.name} !`);
	}

	@UseGuards(SocketGuard)
	@SubscribeMessage('acceptfriendrequest')
	async acceptFriendRequest(client: Socket, data: any)
	{
		console.log("Try to accept request")
		console.log(data.name);
		if (data.name === undefined)
		{
			client.emit("acceptfriendrequest", errorMessages.MISSINGNAME);
			return ;
		}
		let sender : number | undefined;
		if ((sender = this.wsRelationService.isRegistered(client)) === undefined)
		{
			client.emit("acceptfriendrequest", errorMessages.NOTREGISTERED);
			return ;
		}
		let ret = await this.wsRelationService.acceptFriendRequest(sender, data.name);
		if (ret === -1)
		{
			client.emit("acceptfriendrequest", errorMessages.INVALIDNAME);
			return ;
		}
		if (ret === -2)
		{
			client.emit("acceptfriendrequest", errorMessages.NOREQUEST);
			return ;
		}
		client.emit("acceptfriendrequest", `You and ${data.name} are now friends !`);
	}

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
