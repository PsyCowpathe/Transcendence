import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import { SocketGuard } from '../guard/socket.guard';

import { sendError, sendSuccess } from '../../common/response';
import { errorMessages } from '../../common/global'; 

import { WsRelationService } from './wsrelation.service';

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
			return (client.emit("sendfriendrequest", errorMessages.MISSINGNAME));
		let sender : number | undefined;
		if ((sender = this.wsRelationService.isRegistered(client)) === undefined)
		{
			client.emit("sendfriendrequest", errorMessages.NOTREGISTERED);
			return ;
		}
		let ret = await this.wsRelationService.sendFriendRequest(sender, data.user);
		if (ret === -1)
			return (client.emit("sendfriendrequest", errorMessages.INVALIDNAME));
		if (ret === -2)
			return (client.emit("sendfriendrequest", errorMessages.YOUAREIGNORED));
		if (ret === -3)
			return (client.emit("sendfriendrequest", errorMessages.ALREADYFRIEND));
		if (ret === -4)
			return (client.emit("sendfriendrequest", errorMessages.REQUESTTOIGNORE));
		if (ret === -5)
			return (client.emit("sendfriendrequest", errorMessages.ALREADYREQUESTED));
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
			return (client.emit("acceptfriendrequest", errorMessages.MISSINGNAME));
		let sender : number | undefined;
		if ((sender = this.wsRelationService.isRegistered(client)) === undefined)
			return (client.emit("acceptfriendrequest", errorMessages.NOTREGISTERED));
		let ret = await this.wsRelationService.acceptFriendRequest(sender, data.user);
		if (ret === -1)
			return (client.emit("acceptfriendrequest", errorMessages.INVALIDNAME));
		if (ret === -2)
			return (client.emit("acceptfriendrequest", errorMessages.ALREADYFRIEND));
		if (ret === -3)
			return (client.emit("acceptfriendrequest", errorMessages.NOREQUEST));
		client.emit("acceptfriendrequest", `You and ${data.user} are now friends !`);
	}

	@UseGuards(SocketGuard)
	@SubscribeMessage('refusefriendrequest')
	async refuseFriendRequest(client: Socket, data: any)
	{
		console.log("Try to refuse friend request from : ");
		console.log(data.user);
		if (data.user === undefined)
			return (client.emit("refusefriendrequest", errorMessages.MISSINGNAME));
		let sender : number | undefined;
		if ((sender = this.wsRelationService.isRegistered(client)) === undefined)
			return (client.emit("refusefriendrequest", errorMessages.NOTREGISTERED));
		let ret = await this.wsRelationService.refuseFriendRequest(sender, data.user);
		if (ret === -1)
			return (client.emit("refusefriendrequest", errorMessages.INVALIDNAME));
		if (ret === -2)
			return (client.emit("refusefriendrequest", errorMessages.NOREQUEST));
		client.emit("refusefriendrequest", `You denied ${data.user} friend's request !`);
	}

	@UseGuards(SocketGuard)
	@SubscribeMessage('deletefriend')
	async deleteFriend(client: Socket, data: any)
	{
		console.log("Try to delete friend : ");
		console.log(data.user);
		if (data.user === undefined)
			return (client.emit("deletefriend", errorMessages.MISSINGNAME));
		let sender : number | undefined;
		if ((sender = this.wsRelationService.isRegistered(client)) === undefined)
			return (client.emit("deletefriend", errorMessages.NOTREGISTERED));
		let ret = await this.wsRelationService.deleteFriend(sender, data.user);
		if (ret === -1)
			return (client.emit("deletefriend", errorMessages.INVALIDNAME));
		if (ret === -2)
			return (client.emit("deletefriend", errorMessages.NOTFRIEND));
		client.emit("deletefriend", `You and ${data.user} are no longer friend !`);
	}

	@UseGuards(SocketGuard)
	@SubscribeMessage('blockuser')
	async blockUser(client: Socket, data: any)
	{
		console.log("Block user : ");
		console.log(data.user);
		if (data.user === undefined)
			return (client.emit("blockuser", errorMessages.MISSINGNAME));
		let sender : number | undefined;
		if ((sender = this.wsRelationService.isRegistered(client)) === undefined)
			return (client.emit("blockuser", errorMessages.NOTREGISTERED));
		let ret = await this.wsRelationService.blockUser(sender, data.user);
		if (ret === -1)
			return (client.emit("blockuser", errorMessages.INVALIDNAME));
		if (ret === -2)
			return (client.emit("blockuser", errorMessages.ALREADYIGNORED));
		client.emit("blockuser", `You now ignore ${data.user} !`);
	}

	@UseGuards(SocketGuard)
	@SubscribeMessage('unblockuser')
	async unBlockUser(client: Socket, data: any)
	{
		console.log("Try to unblock user : ");
		console.log(data.user);
		if (data.user === undefined)
			return (client.emit("unblockuser", errorMessages.MISSINGNAME));
		let sender : number | undefined;
		if ((sender = this.wsRelationService.isRegistered(client)) === undefined)
			return (client.emit("unblockuser", errorMessages.NOTREGISTERED));
		let ret = await this.wsRelationService.unBlockUser(sender, data.user);
		if (ret === -1)
			return (client.emit("unblockuser", errorMessages.INVALIDNAME));
		if (ret === -2)
			return (client.emit("unblockuser", errorMessages.NOTIGNORED));
		client.emit("unblockuser", `You no longer ignore ${data.user} !`);
	}
}
