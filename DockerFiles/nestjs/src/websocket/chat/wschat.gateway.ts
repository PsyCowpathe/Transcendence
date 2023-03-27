import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import { SocketGuard } from '../guard/socket.guard';

import { sendError, sendSuccess } from '../../common/response';
import { errorMessages } from '../../common/global';

import { WsChatService }  from './wschat.service';
import { createChannelDto, channelOperationDto, userOperationDto, sanctionOperationDto } from './wschat.entity';

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
		console.log(channelForm);
		let sender : number | undefined;
		if ((sender = this.wsChatService.isRegistered(client)) === undefined)
			return (client.emit("createchannel", errorMessages.NOTREGISTERED));
		let ret = await this.wsChatService.createChannel(sender, channelForm);
		console.log("ret = " + ret);
		if (ret === -1)
			return (client.emit("createchannel", errorMessages.CHANNELALREADYEXIST));
		if (ret === -2)
			return (client.emit("createchannel", errorMessages.PRIVATEORPASSWORD));
		client.emit("createchannel", `Channel ${channelForm.name} successfully created !`);
	}

	@UseGuards(SocketGuard)
	@SubscribeMessage('addadmin')
	async addAdmin(client: Socket, adminForm: userOperationDto)
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
			return (client.emit("addadmin", errorMessages.NOTTHEOWNER));
		if (ret === -3)
			return (client.emit("addadmin", errorMessages.INVALIDNAME));
		if (ret === -4)
			return (client.emit("addadmin", errorMessages.NOTINTHISCHANNEL));
		if (ret === -5)
			return (client.emit("addadmin", errorMessages.ALREADYADMIN));
		client.emit("addadmin", `User ${adminForm.name} successfully promoted to administrator !`);
	}

	@UseGuards(SocketGuard)
	@SubscribeMessage('removeadmin')
	async removeAdmin(client: Socket, adminForm: userOperationDto)
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
			return (client.emit("addadmin", errorMessages.NOTTHEOWNER));
		if (ret === -3)
			return (client.emit("removeadmin", errorMessages.INVALIDNAME));
		if (ret === -4)
			return (client.emit("addadmin", errorMessages.NOTINTHISCHANNEL));
		if (ret === -5)
			return (client.emit("removeadmin", errorMessages.NOTANADMINISTRATOR));
		client.emit("removeadmin", `User ${adminForm.name} successfully demoted from administrator !`);
	}

	@UseGuards(SocketGuard)
	@SubscribeMessage('joinchannel')
	async joinChannel(client: Socket, joinForm: channelOperationDto)
	{
		console.log("Join channel !");
		console.log(joinForm.name + " for " + joinForm.channelname);
		let sender : number | undefined;
		if ((sender = this.wsChatService.isRegistered(client)) === undefined)
			return (client.emit("joinchannel", errorMessages.NOTREGISTERED));
		let ret = await this.wsChatService.joinChannel(sender, joinForm);
		if (ret === -1)
			return (client.emit("joinchannel", errorMessages.CHANNELDONTEXIST));
		if (ret === -2)//may be useless
			return (client.emit("joinchannel", errorMessages.INVALIDNAME));//may be useless
		if (ret === -3)
			return (client.emit("joinchannel", errorMessages.ALREADYINCHANNEL));
		if (ret === -4)
			return (client.emit("joinchannel", errorMessages.INCORRECTPASSWORD));
		if (ret === -5)
			return (client.emit("joinchannel", errorMessages.NOTONTHELIST));
		let response =
		{
			message : `You successfully joined the channel ${joinForm.channelname} !`,
			channel : joinForm.channelname,
		}
		client.emit("joinchannel", response);
	}

	@UseGuards(SocketGuard)
	@SubscribeMessage('leavechannel')
	async leaveChannel(client: Socket, leaveForm: channelOperationDto)
	{
		console.log("Leave channel !");
		console.log(leaveForm.name + " for " + leaveForm.channelname);
		let sender : number | undefined;
		if ((sender = this.wsChatService.isRegistered(client)) === undefined)
			return (client.emit("leavechannel", errorMessages.NOTREGISTERED));
		let ret = await this.wsChatService.leaveChannel(sender, leaveForm);
		if (ret === -1)
			return (client.emit("leavechannel", errorMessages.CHANNELDONTEXIST));
		if (ret === -2)//may be useless
			return (client.emit("leavechannel", errorMessages.INVALIDNAME));//may be useless
		if (ret === -3)
			return (client.emit("leavechannel", errorMessages.NOTJOINED));
		if (ret === -4)
			return (client.emit("leavechannel", errorMessages.ACAPTAINDONTLEAVEHISSHIP));
		let response =
		{
			message : `You successfully leaved the channel ${leaveForm.channelname} !`,
			channel : leaveForm.channelname,
		}
		client.emit("leavechannel", response);
	}

	@UseGuards(SocketGuard)
	@SubscribeMessage('createinvitation')
	async createInvitation(client: Socket, invitationForm: userOperationDto)
	{
		console.log("Create invitation !");
		console.log(invitationForm.name + " for " + invitationForm.channelname);
		let sender : number | undefined;
		if ((sender = this.wsChatService.isRegistered(client)) === undefined)
			return (client.emit("createinvitation", errorMessages.NOTREGISTERED));
		let ret = await this.wsChatService.createInvitation(sender, invitationForm);
		if (ret === -1)
			return (client.emit("createinvitation", errorMessages.CHANNELDONTEXIST));
		if (ret === -2)//may be useless
			return (client.emit("createinvitation", errorMessages.INVALIDNAME));//may be useless
		if (ret === -3)
			return (client.emit("createinvitation", errorMessages.INVALIDNAME));
		if (ret === -4)
			return (client.emit("createinvitation", errorMessages.ALREADYINCHANNEL));
		if (ret === -5)
			return (client.emit("createinvitation", errorMessages.NOTOP));
		client.emit("createinvitation",
			`User ${invitationForm.name} has been successfully invited to channel ${invitationForm.channelname}!`);
	}

	@UseGuards(SocketGuard)
	@SubscribeMessage('deleteinvitation')
	async deleteInvitation(client: Socket, invitationForm: userOperationDto)
	{
		console.log("Delete invitation !");
		console.log(invitationForm.name + " for " + invitationForm.channelname);
		let sender : number | undefined;
		if ((sender = this.wsChatService.isRegistered(client)) === undefined)
			return (client.emit("deleteinvitation", errorMessages.NOTREGISTERED));
		let ret = await this.wsChatService.createInvitation(sender, invitationForm);
		if (ret === -1)
			return (client.emit("deleteinvitation", errorMessages.CHANNELDONTEXIST));
		if (ret === -2)//may be useless
			return (client.emit("deleteinvitation", errorMessages.INVALIDNAME));//may be useless
		if (ret === -3)
			return (client.emit("deleteinvitation", errorMessages.INVALIDNAME));
		if (ret === -4)
			return (client.emit("deleteinvitation", errorMessages.NOTINVITED));
		client.emit("deleteinvitation", `You successfully deleted the invitation of ${invitationForm.name} for channel ${invitationForm.channelname} !`);
	}

	@UseGuards(SocketGuard)
	@SubscribeMessage('deletechannel')
	async deleteChannel(client: Socket, deleteForm: channelOperationDto)
	{
		console.log("Delete channel ");
		console.log(deleteForm.channelname);
		let sender : number | undefined;
		if ((sender = this.wsChatService.isRegistered(client)) === undefined)
			return (client.emit("deletechannel", errorMessages.NOTREGISTERED));
		let ret = await this.wsChatService.deleteChannel(sender, deleteForm);
		if (ret === -1)
			return (client.emit("deletechannel", errorMessages.CHANNELDONTEXIST));
		if (ret === -2) // may be useless
			return (client.emit("deletechannel", errorMessages.INVALIDNAME));//may be useless
		if (ret === -3)
			return (client.emit("deletechannel", errorMessages.NOTTHEOWNER));
		let response =
		{
			message : `You successfully deleted the channel ${deleteForm.channelname} !`,
			channel : deleteForm.channelname,
		}
		client.emit("deletechannel", response);
	}

	@UseGuards(SocketGuard)
	@SubscribeMessage('kickuser')
	async kickUser(client: Socket, kickForm: sanctionOperationDto)
	{
		console.log("Kick user ");
		console.log(kickForm.name);
		let sender : number | undefined;
		if ((sender = this.wsChatService.isRegistered(client)) === undefined)
			return (client.emit("kickuser", errorMessages.NOTREGISTERED));
		let ret = await this.wsChatService.kickUser(sender, kickForm);
		if (ret === -1)
			return (client.emit("kickuser", errorMessages.CHANNELDONTEXIST));
		if (ret === -2)
			return (client.emit("kickuser", errorMessages.INVALIDNAME));
		if (ret === -3)
			return (client.emit("kickuser", errorMessages.INVALIDNAME));
		if (ret === -4)
			return (client.emit("kickuser", errorMessages.NOTOP));
		if (ret === -5)
			return (client.emit("kickuser", errorMessages.CANTSANCTIONOWNER));
		if (ret === -6)
			return (client.emit("kickuser", errorMessages.CANTSANCTIONEQUAL));
		if (ret === -7)
			return (client.emit("kickuser", errorMessages.NOTINTHISCHANNEL));
		let response =
		{
			message : `You successfully kicked user ${kickForm.name} !`,
			user : kickForm.name,
		}
		client.emit("kickuser", response);
	}

	@UseGuards(SocketGuard)
	@SubscribeMessage('banuser')
	async banUser(client: Socket, banForm: sanctionOperationDto)
	{
		console.log("Ban user ");
		console.log(banForm.name);
		let sender : number | undefined;
		if ((sender = this.wsChatService.isRegistered(client)) === undefined)
			return (client.emit("banuser", errorMessages.NOTREGISTERED));
		let ret = await this.wsChatService.kickUser(sender, banForm);
		if (ret === -1)
			return (client.emit("banuser", errorMessages.CHANNELDONTEXIST));
		if (ret === -2)
			return (client.emit("banuser", errorMessages.INVALIDNAME));
		if (ret === -3)
			return (client.emit("banuser", errorMessages.INVALIDNAME));
		if (ret === -4)
			return (client.emit("banuser", errorMessages.NOTOP));
		if (ret === -5)
			return (client.emit("banuser", errorMessages.CANTSANCTIONOWNER));
		if (ret === -6)
			return (client.emit("banuser", errorMessages.CANTSANCTIONEQUAL));
		if (ret === -7)
			return (client.emit("banuser", errorMessages.NOTINTHISCHANNEL));
		let response =
		{
			message : `You successfully banned user ${banForm.name} !`,
			user : banForm.name,
		}
		client.emit("banuser", response);
	}

	@UseGuards(SocketGuard)
	@SubscribeMessage('muteuser')
	async muteUser(client: Socket, muteForm: sanctionOperationDto)
	{
		console.log("Mute user ");
		console.log(muteForm.name);
		let sender : number | undefined;
		if ((sender = this.wsChatService.isRegistered(client)) === undefined)
			return (client.emit("muteuser", errorMessages.NOTREGISTERED));
		let ret = await this.wsChatService.kickUser(sender, muteForm);
		if (ret === -1)
			return (client.emit("muteuser", errorMessages.CHANNELDONTEXIST));
		if (ret === -2)
			return (client.emit("muteuser", errorMessages.INVALIDNAME));
		if (ret === -3)
			return (client.emit("muteuser", errorMessages.INVALIDNAME));
		if (ret === -4)
			return (client.emit("muteuser", errorMessages.NOTOP));
		if (ret === -5)
			return (client.emit("muteuser", errorMessages.CANTSANCTIONOWNER));
		if (ret === -6)
			return (client.emit("muteuser", errorMessages.CANTSANCTIONEQUAL));
		if (ret === -7)
			return (client.emit("muteuser", errorMessages.NOTINTHISCHANNEL));
		let response =
		{
			message : `You successfully muted user ${muteForm.name} !`,
			user : muteForm.name,
		}
		client.emit("muteuser", response);
	}
}
