import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import { SocketGuard } from '../guard/socket.guard';

import { sendError, sendSuccess } from '../../common/response';
import { errorMessages } from '../../common/global';

import { WsChatService }  from './wschat.service';
import { createChannelDto, adminOperationDto, channelOperationDto } from './wschat.entity';

@WebSocketGateway(3632, {cors: true})

export class WsChatGateway
{
	constructor(private readonly wsChatService: WsChatService)
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
		this.wsChatService.saveChatSocket(client, clientToken);
	}

	@UseGuards(SocketGuard)
	@SubscribeMessage('createchannel')
	async createChannel(client: Socket, channelForm: createChannelDto)
	{
		console.log("New channel created !");
		console.log(channelForm.name);
		let sender : number | undefined;
		if ((sender = this.wsChatService.isRegistered(client)) === undefined)
			return (client.emit("createchannel", errorMessages.NOTREGISTERED));
		let ret = await this.wsChatService.createChannel(sender, channelForm);
		if (ret === -1)
			return (client.emit("createchannel", errorMessages.CHANNELALREADYEXIST));
		if (ret === -2)
			return (client.emit("createchannel", errorMessages.PRIVATEORPASSWORD));
		client.emit("createchannel", `Channel ${channelForm.name} successfully created !`);
	}

	@UseGuards(SocketGuard)
	@SubscribeMessage('addadmin')
	async addAdmin(client: Socket, adminForm: adminOperationDto)
	{
		console.log("New admin !");
		console.log(adminForm.name + " for " + adminForm.channelname);
		let sender : number | undefined;
		if ((sender = this.wsChatService.isRegistered(client)) === undefined)
			return (client.emit("addadmin", errorMessages.NOTREGISTERED));
		let ret = await this.wsChatService.addAdmin(sender, adminForm);
		if (ret === -1)
			return (client.emit("addadmin", errorMessages.CHANNELDONTEXIST));
		if (ret === -2)
			return (client.emit("addadmin", errorMessages.INVALIDNAME));
		if (ret === -3)
			return (client.emit("addadmin", errorMessages.NOTINTHISCHANNEL));
		if (ret === -4)
			return (client.emit("addadmin", errorMessages.ALREADYADMIN));
		client.emit("addadmin", `User ${adminForm.name} successfully promoted to administrator !`);
	}

	@UseGuards(SocketGuard)
	@SubscribeMessage('removeadmin')
	async removeAdmin(client: Socket, adminForm: adminOperationDto)
	{
		console.log("Remove admin !");
		console.log(adminForm.name + " for " + adminForm.channelname);
		let sender : number | undefined;
		if ((sender = this.wsChatService.isRegistered(client)) === undefined)
			return (client.emit("removeadmin", errorMessages.NOTREGISTERED));
		let ret = await this.wsChatService.removeAdmin(sender, adminForm);
		if (ret === -1)
			return (client.emit("removeadmin", errorMessages.CHANNELDONTEXIST));
		if (ret === -2)
			return (client.emit("removeadmin", errorMessages.INVALIDNAME));
		if (ret === -3)
			return (client.emit("addadmin", errorMessages.NOTINTHISCHANNEL));
		if (ret === -4)
			return (client.emit("removeadmin", errorMessages.NOTANADMINISTRATOR));
		client.emit("removeadmin", `User ${adminForm.name} successfully demoted from administrator !`);
	}

	@UseGuards(SocketGuard)
	@SubscribeMessage('joinchannel')
	async joinchannel(client: Socket, joinForm: channelOperationDto)
	{
		console.log("Join channel !");
		console.log(joinForm.name + " for " + joinForm.channelname);
		let sender : number | undefined;
		if ((sender = this.wsChatService.isRegistered(client)) === undefined)
			return (client.emit("joinchannel", errorMessages.NOTREGISTERED));
		let ret = await this.wsChatService.joinChannel(sender, joinForm);
		if (ret === -1)
			return (client.emit("joinchannel", errorMessages.CHANNELDONTEXIST));
		if (ret === -2)
			return (client.emit("joinchannel", errorMessages.INVALIDNAME));
		if (ret === -3)
			return (client.emit("joinchannel", errorMessages.ALREADYINCHANNEL));
		if (ret === -4)
			return (client.emit("joinchannel", errorMessages.INCORRECTPASSWORD));
		client.emit("joinchannel", `You successfully joined channel : ${joinForm.channelname} !`);
	}
}
