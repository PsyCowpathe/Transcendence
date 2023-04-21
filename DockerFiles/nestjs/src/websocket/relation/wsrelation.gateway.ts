import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { UseGuards, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import { SocketGuard } from '../guard/socket.guard';

import { sendError, sendSuccess } from '../../common/response';
import { errorMessages } from '../../common/global'; 

import { relationDto, requestDto } from './wsrelation.entity';

import { WsRelationService } from './wsrelation.service';
import { WsExceptionFilter } from '../guard/ws.filter'; 

@UseFilters(WsExceptionFilter)
@WebSocketGateway(3631, {cors: true})
export class WsRelationGateway implements OnGatewayConnection
{
	constructor(private readonly wsRelationService: WsRelationService)
	{

	}

	async handleConnection(client: Socket)
    {
		let clientToken = client.handshake.auth.token;
		await this.wsRelationService.saveRelationSocket(client, clientToken);
    }

	@WebSocketServer()
	server: Server;

	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('sendfriendrequest')
	async sendFriendRequest(client: Socket, data: requestDto)
	{
		let sender : number | undefined;
		if ((sender = this.wsRelationService.isRegistered(client)) === undefined)
			return (client.emit("RelationError", errorMessages.NOTREGISTERED));
		let ret = await this.wsRelationService.sendFriendRequest(sender, data.user);
		if (ret === -1)
			return (client.emit("RelationError", errorMessages.INVALIDNAME));
		if (ret === -2)
			return (client.emit("RelationError", errorMessages.SOSFRIEND));
		if (ret === -3)
			return (client.emit("RelationError", errorMessages.YOUAREIGNORED));
		if (ret === -4)
			return (client.emit("RelationError", errorMessages.ALREADYFRIEND));
		if (ret === -5)
			return (client.emit("RelationError", errorMessages.REQUESTTOIGNORE));
		if (ret === -6)
			return (client.emit("RelationError", errorMessages.ALREADYREQUESTED));
		client.emit("sendfriendrequest", `Request successfully send to ${data.user} !`);
		return ;
	}

	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('acceptfriendrequest')
	async acceptFriendRequest(client: Socket, data: relationDto)
	{
		if (data.user === undefined)
			return (client.emit("RelationError", errorMessages.MISSINGNAME));
		let sender : number | undefined;
		if ((sender = this.wsRelationService.isRegistered(client)) === undefined)
			return (client.emit("RelationError", errorMessages.NOTREGISTERED));
		let ret = await this.wsRelationService.acceptFriendRequest(sender, data.user);
		if (ret === -1)
			return (client.emit("RelationError", errorMessages.INVALIDNAME));
		if (ret === -2)
			return (client.emit("RelationError", errorMessages.ALREADYFRIEND));
		if (ret === -3)
			return (client.emit("RelationError", errorMessages.ACCEPTTOIGNORE));
		if (ret === -4)
			return (client.emit("RelationError", errorMessages.NOREQUEST));
		client.emit("acceptfriendrequest", `You and ${ret} are now friends !`);
	}

	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('refusefriendrequest')
	async refuseFriendRequest(client: Socket, data: relationDto)
	{
		if (data.user === undefined)
			return (client.emit("RelationError", errorMessages.MISSINGNAME));
		let sender : number | undefined;
		if ((sender = this.wsRelationService.isRegistered(client)) === undefined)
			return (client.emit("RelationError", errorMessages.NOTREGISTERED));
		let ret = await this.wsRelationService.refuseFriendRequest(sender, data.user);
		if (ret === -1)
			return (client.emit("RelationError", errorMessages.INVALIDNAME));
		if (ret === -2)
			return (client.emit("RelationError", errorMessages.NOREQUEST));
		client.emit("refusefriendrequest", `You denied ${ret} friend's request !`);
	}

	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('deletefriend')
	async deleteFriend(client: Socket, data: relationDto)
	{
		if (data.user === undefined)
			return (client.emit("RelationError", errorMessages.MISSINGNAME));
		let sender : number | undefined;
		if ((sender = this.wsRelationService.isRegistered(client)) === undefined)
			return (client.emit("RelationError", errorMessages.NOTREGISTERED));
		let ret = await this.wsRelationService.deleteFriend(sender, data.user);
		if (ret === -1)
			return (client.emit("RelationError", errorMessages.INVALIDNAME));
		if (ret === -2)
			return (client.emit("RelationError", errorMessages.NOTFRIEND));
		client.emit("deletefriend", `You and ${ret} are no longer friend !`);
	}

	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('blockuser')
	async blockUser(client: Socket, data: relationDto)
	{
		if (data.user === undefined)
			return (client.emit("RelationError", errorMessages.MISSINGNAME));
		let sender : number | undefined;
		if ((sender = this.wsRelationService.isRegistered(client)) === undefined)
			return (client.emit("RelationError", errorMessages.NOTREGISTERED));
		let ret = await this.wsRelationService.blockUser(sender, data.user);
		if (ret === -1)
			return (client.emit("RelationError", errorMessages.INVALIDNAME));
		if (ret === -2)
			return (client.emit("RelationError", errorMessages.YOUARECRINGE));
		if (ret === -3)
			return (client.emit("RelationError", errorMessages.ALREADYIGNORED));
		client.emit("blockuser", `You now ignore ${ret} !`);
	}

	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('unblockuser')
	async unBlockUser(client: Socket, data: relationDto)
	{
		if (data.user === undefined)
			return (client.emit("RelationError", errorMessages.MISSINGNAME));
		let sender : number | undefined;
		if ((sender = this.wsRelationService.isRegistered(client)) === undefined)
			return (client.emit("RelationError", errorMessages.NOTREGISTERED));
		let ret = await this.wsRelationService.unBlockUser(sender, data.user);
		if (ret === -1)
			return (client.emit("RelationError", errorMessages.INVALIDNAME));
		if (ret === -2)
			return (client.emit("RelationError", errorMessages.NOTIGNORED));
		client.emit("unblockuser", `You no longer ignore ${ret} !`);
	}
}
