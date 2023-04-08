import { SubscribeMessage, WebSocketGateway, WebSocketServer  } from '@nestjs/websockets';
import { UseGuards, UseFilters } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import { SocketGuard } from '../guard/socket.guard';

import { sendError, sendSuccess } from '../../common/response';
import { errorMessages } from '../../common/global'; 

import { WsRelationService } from './wsrelation.service';
import { WsExceptionFilter } from '../guard/ws.filter'; 

@UseFilters(WsExceptionFilter)
@WebSocketGateway(3631, {cors: true}) //userspace relation
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
		console.log("New request to user : ");
		console.log(data.user);
		if (data.user === undefined)
			return (client.emit("RelationError", errorMessages.MISSINGNAME));
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
	@SubscribeMessage('acceptfriendrequest')
	async acceptFriendRequest(client: Socket, data: any)
	{
		console.log("Try to accept request from : ");
		console.log(data.user);
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
			return (client.emit("RelationError", errorMessages.NOREQUEST));
		client.emit("acceptfriendrequest", `You and ${data.user} are now friends !`);
	}

	@UseGuards(SocketGuard)
	@SubscribeMessage('refusefriendrequest')
	async refuseFriendRequest(client: Socket, data: any)
	{
		console.log("Try to refuse friend request from : ");
		console.log(data.user);
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
		client.emit("refusefriendrequest", `You denied ${data.user} friend's request !`);
	}

	@UseGuards(SocketGuard)
	@SubscribeMessage('deletefriend')
	async deleteFriend(client: Socket, data: any)
	{
		console.log("Try to delete friend : ");
		console.log(data.user);
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
		client.emit("deletefriend", `You and ${data.user} are no longer friend !`);
	}

	@UseGuards(SocketGuard)
	@SubscribeMessage('blockuser')
	async blockUser(client: Socket, data: any)
	{
		console.log("Block user : ");
		console.log(data.user);
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
				client.emit("blockuser", `You now ignore ${data.user} !`);
	}

	@UseGuards(SocketGuard)
	@SubscribeMessage('unblockuser')
	async unBlockUser(client: Socket, data: any)
	{
		console.log("Try to unblock user : ");
		console.log(data.user);
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
		client.emit("unblockuser", `You no longer ignore ${data.user} !`);
	}
}
