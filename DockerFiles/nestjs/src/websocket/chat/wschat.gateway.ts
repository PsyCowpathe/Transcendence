import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import {UsePipes, ValidationPipe, UseGuards, UseFilters } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import { SocketGuard } from '../guard/socket.guard';

import { sendError, sendSuccess } from '../../common/response';
import { errorMessages } from '../../common/global';

import { WsChatService }  from './wschat.service';
import { createChannelDto, channelOperationDto, userOperationDto, sanctionOperationDto, messageDto } from './wschat.entity';

import { WsExceptionFilter } from './ws.filter'; 

@UseFilters(WsExceptionFilter)
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


	//=======					Channel					=======


	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('createchannel')
	async createChannel(client: Socket, channelForm: createChannelDto)
	{
		console.log("New channel created !");
		console.log(channelForm);
		let sender : number | undefined;
		if ((sender = this.wsChatService.isRegistered(client)) === undefined)
			return (client.emit("ChatError", errorMessages.NOTREGISTERED));
		let ret = await this.wsChatService.createChannel(sender, channelForm);
		console.log("ret = " + ret);
		if (ret === -1)
			return (client.emit("ChatError", errorMessages.CHANNELALREADYEXIST));
		if (ret === -2)
			return (client.emit("ChatError", errorMessages.PRIVATEORPASSWORD));
		client.emit("createchannel", `Channel ${channelForm.channelname} successfully created !`);
	}

	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('deletechannel')
	async deleteChannel(client: Socket, deleteForm: channelOperationDto)
	{
		console.log("Delete channel ");
		console.log(deleteForm.channelname);
		let sender : number | undefined;
		if ((sender = this.wsChatService.isRegistered(client)) === undefined)
			return (client.emit("ChatError", errorMessages.NOTREGISTERED));
		let ret = await this.wsChatService.deleteChannel(sender, deleteForm);
		if (ret === -1)
			return (client.emit("ChatError", errorMessages.CHANNELDONTEXIST));
		if (ret === -2) // may be useless
			return (client.emit("ChatError", errorMessages.INVALIDNAME));//may be useless
		if (ret === -3)
			return (client.emit("ChatError", errorMessages.NOTTHEOWNER));
		let response =
		{
			message : `You successfully deleted the channel ${deleteForm.channelname} !`,
			channel : deleteForm.channelname,
		}
		client.emit("deletechannel", response);
	}


	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('joinchannel')
	async joinChannel(client: Socket, joinForm: channelOperationDto)
	{
		console.log("Join channel !");
		console.log("for " + joinForm.channelname);
		let sender : number | undefined;
		if ((sender = this.wsChatService.isRegistered(client)) === undefined)
			return (client.emit("ChatError", errorMessages.NOTREGISTERED));
		let ret = await this.wsChatService.joinChannel(sender, joinForm);
		if (ret === -1)
			return (client.emit("ChatError", errorMessages.CHANNELDONTEXIST));
		if (ret === -2)//may be useless
			return (client.emit("ChatError", errorMessages.INVALIDNAME));//may be useless
		if (ret === -3)
			return (client.emit("ChatError", errorMessages.ALREADYINCHANNEL));
		if (ret === -4)
			return (client.emit("ChatError", errorMessages.YOUAREBAN));
		if (ret === -5)
			return (client.emit("ChatError", errorMessages.INCORRECTPASSWORD));
		if (ret === -6)
			return (client.emit("ChatError", errorMessages.NOTONTHELIST));
		let response =
		{
			message : `You successfully joined the channel ${joinForm.channelname} !`,
			channel : joinForm.channelname,
		}
		client.emit("joinchannel", response);
	}

	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('leavechannel')
	async leaveChannel(client: Socket, leaveForm: channelOperationDto)
	{
		console.log("Leave channel !");
		console.log(" for " + leaveForm.channelname);
		let sender : number | undefined;
		if ((sender = this.wsChatService.isRegistered(client)) === undefined)
			return (client.emit("ChatError", errorMessages.NOTREGISTERED));
		let ret = await this.wsChatService.leaveChannel(sender, leaveForm);
		if (ret === -1)
			return (client.emit("ChatError", errorMessages.CHANNELDONTEXIST));
		if (ret === -2)//may be useless
			return (client.emit("ChatError", errorMessages.INVALIDNAME));//may be useless
		if (ret === -3)
			return (client.emit("ChatError", errorMessages.NOTJOINED));
		if (ret === -4)
			return (client.emit("ChatError", errorMessages.ACAPTAINDONTLEAVEHISSHIP));
		let response =
		{
			message : `You successfully leaved the channel ${leaveForm.channelname} !`,
			channel : leaveForm.channelname,
		}
		client.emit("leavechannel", response);
	}

	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('channelmsg')
	async sendChannelMessage(client: Socket, messageForm: messageDto)
	{
		console.log("New message :");//
		console.log(messageForm.message);//
		console.log(" to ");//
		console.log(messageForm.destination);//
		client.emit('channelmsg', {user: "PsyCowpathe", texte: "coucou"});//

		let sender : number | undefined;
		if ((sender = this.wsChatService.isRegistered(client)) === undefined)
			return (client.emit("ChatError", errorMessages.NOTREGISTERED));
		let ret = await this.wsChatService.channelMessage(sender, messageForm);
		if (ret === -1)
			return (client.emit("ChatError", errorMessages.CHANNELDONTEXIST));
		if (ret === -2)
			return (client.emit("ChatError", errorMessages.INVALIDNAME));
		if (ret === -3)
			return (client.emit("ChatError", errorMessages.NOTJOINED));
		if (ret === -4)
			return (client.emit("ChatError", errorMessages.YOUAREMUTE));
	}


	//=======					User					=======


	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('addadmin')
	async addAdmin(client: Socket, adminForm: userOperationDto)
	{
		console.log("New admin !");
		console.log(adminForm.name + " for " + adminForm.channelname);
		let sender : number | undefined;
		if ((sender = this.wsChatService.isRegistered(client)) === undefined)
			return (client.emit("ChatError", errorMessages.NOTREGISTERED));
		let ret = await this.wsChatService.addAdmin(sender, adminForm);
		if (ret === -1)
			return (client.emit("ChatError", errorMessages.CHANNELDONTEXIST));
		if (ret === -2)
			return (client.emit("ChatError", errorMessages.NOTTHEOWNER));
		if (ret === -3)
			return (client.emit("ChatError", errorMessages.INVALIDNAME));
		if (ret === -4)
			return (client.emit("ChatError", errorMessages.NOTINTHISCHANNEL));
		if (ret === -5)
			return (client.emit("ChatError", errorMessages.ALREADYADMIN));
		client.emit("addadmin", `User ${adminForm.name} successfully promoted to administrator !`);
	}

	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('removeadmin')
	async removeAdmin(client: Socket, adminForm: userOperationDto)
	{
		console.log("Remove admin !");
		console.log(adminForm.name + " for " + adminForm.channelname);
		let sender : number | undefined;
		if ((sender = this.wsChatService.isRegistered(client)) === undefined)
			return (client.emit("ChatError", errorMessages.NOTREGISTERED));
		let ret = await this.wsChatService.removeAdmin(sender, adminForm);
		if (ret === -1)
			return (client.emit("ChatError", errorMessages.CHANNELDONTEXIST));
		if (ret === -2)
			return (client.emit("ChatError", errorMessages.NOTTHEOWNER));
		if (ret === -3)
			return (client.emit("ChatError", errorMessages.INVALIDNAME));
		if (ret === -4)
			return (client.emit("ChatError", errorMessages.NOTINTHISCHANNEL));
		if (ret === -5)
			return (client.emit("ChatError", errorMessages.NOTANADMINISTRATOR));
		client.emit("removeadmin", `User ${adminForm.name} successfully demoted from administrator !`);
	}

	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('createinvitation')
	async createInvitation(client: Socket, invitationForm: userOperationDto)
	{
		console.log("Create invitation !");
		console.log(invitationForm.name + " for " + invitationForm.channelname);
		let sender : number | undefined;
		if ((sender = this.wsChatService.isRegistered(client)) === undefined)
			return (client.emit("ChatError", errorMessages.NOTREGISTERED));
		let ret = await this.wsChatService.createInvitation(sender, invitationForm);
		if (ret === -1)
			return (client.emit("ChatError", errorMessages.CHANNELDONTEXIST));
		if (ret === -2)//may be useless
			return (client.emit("ChatError", errorMessages.INVALIDNAME));//may be useless
		if (ret === -3)
			return (client.emit("ChatError", errorMessages.INVALIDNAME));
		if (ret === -4)
			return (client.emit("ChatError", errorMessages.ALREADYINCHANNEL));
		if (ret === -5)
			return (client.emit("ChatError", errorMessages.ALREADYINVITED));
		if (ret === -6)
			return (client.emit("ChatError", errorMessages.NOTOP));
		client.emit("createinvitation",
			`User ${invitationForm.name} has been successfully invited to channel ${invitationForm.channelname}!`);
	}

	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('usermessage')
	async sendUserMessage(client: Socket, messageForm: messageDto)
	{
		console.log("User message :");
		console.log(messageForm.message + " to " + messageForm.destination);
		let sender : number | undefined;
		if ((sender = this.wsChatService.isRegistered(client)) === undefined)
			return (client.emit("ChatError", errorMessages.NOTREGISTERED));
		let ret = await this.wsChatService.userMessage(sender, messageForm);
		if (ret === -1)
			return (client.emit("ChatError", errorMessages.INVALIDNAME));
		if (ret === -2)
			return (client.emit("ChatError", errorMessages.INVALIDNAME));
		if (ret === -3)
			return (client.emit("ChatError", errorMessages.YOUAREIGNORED));
		if (ret === -4)
			return (client.emit("ChatError", errorMessages.MESSAGETOIGNORE));
		client.emit("usermessage", `You successfully send a message to ${messageForm.destination} !`);
	}

	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('deleteinvitation')
	async deleteInvitation(client: Socket, invitationForm: userOperationDto)
	{
		console.log("Delete invitation !");
		console.log(invitationForm.name + " for " + invitationForm.channelname);
		let sender : number | undefined;
		if ((sender = this.wsChatService.isRegistered(client)) === undefined)
			return (client.emit("ChatError", errorMessages.NOTREGISTERED));
		let ret = await this.wsChatService.deleteInvitation(sender, invitationForm);
		if (ret === -1)
			return (client.emit("ChatError", errorMessages.CHANNELDONTEXIST));
		if (ret === -2)//may be useless
			return (client.emit("ChatError", errorMessages.INVALIDNAME));//may be useless
		if (ret === -3)
			return (client.emit("ChatError", errorMessages.INVALIDNAME));
		if (ret === -4)
			return (client.emit("ChatError", errorMessages.NOTINVITED));
		client.emit("deleteinvitation", `You successfully deleted the invitation of ${invitationForm.name} for channel ${invitationForm.channelname} !`);
	}


	//=======				 Sanction					=======

	
	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('kickuser')
	async kickUser(client: Socket, kickForm: sanctionOperationDto)
	{
		console.log("Kick user ");
		console.log(kickForm.name);
		let sender : number | undefined;
		if ((sender = this.wsChatService.isRegistered(client)) === undefined)
			return (client.emit("ChatError", errorMessages.NOTREGISTERED));
		let ret = await this.wsChatService.kickUser(sender, kickForm);
		if (ret === -1)
			return (client.emit("ChatError", errorMessages.CHANNELDONTEXIST));
		if (ret === -2)
			return (client.emit("ChatError", errorMessages.INVALIDNAME));
		if (ret === -3)
			return (client.emit("ChatError", errorMessages.INVALIDNAME));
		if (ret === -4)
			return (client.emit("ChatError", errorMessages.NOTOP));
		if (ret === -5)
			return (client.emit("ChatError", errorMessages.CANTSANCTIONOWNER));
		if (ret === -6)
			return (client.emit("ChatError", errorMessages.CANTSANCTIONEQUAL));
		if (ret === -7)
			return (client.emit("ChatError", errorMessages.NOTINTHISCHANNEL));
		let response =
		{
			message : `You successfully kicked user ${kickForm.name} !`,
			user : kickForm.name,
		}
		client.emit("kickuser", response);
	}

	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('banuser')
	async banUser(client: Socket, banForm: sanctionOperationDto)
	{
		console.log("Ban user ");
		console.log(banForm.name);
		let sender : number | undefined;
		if ((sender = this.wsChatService.isRegistered(client)) === undefined)
			return (client.emit("ChatError", errorMessages.NOTREGISTERED));
		let ret = await this.wsChatService.banUser(sender, banForm);
		if (ret === -1)
			return (client.emit("ChatError", errorMessages.CHANNELDONTEXIST));
		if (ret === -2)
			return (client.emit("ChatError", errorMessages.INVALIDNAME));
		if (ret === -3)
			return (client.emit("ChatError", errorMessages.INVALIDNAME));
		if (ret === -4)
			return (client.emit("ChatError", errorMessages.NOTOP));
		if (ret === -5)
			return (client.emit("ChatError", errorMessages.CANTSANCTIONOWNER));
		if (ret === -6)
			return (client.emit("ChatError", errorMessages.CANTSANCTIONEQUAL));
		if (ret === -7)
			return (client.emit("ChatError", errorMessages.NOTINTHISCHANNEL));
		if (ret === -8)
			return (client.emit("ChatError", errorMessages.ALREADYBAN));
		let response =
		{
			message : `You successfully banned user ${banForm.name} !`,
			user : banForm.name,
		}
		client.emit("banuser", response);
	}

	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('unbanuser')
	async unbanUser(client: Socket, unbanForm: sanctionOperationDto)
	{
		console.log("Unban user ");
		console.log(unbanForm.name);
		let sender : number | undefined;
		if ((sender = this.wsChatService.isRegistered(client)) === undefined)
			return (client.emit("ChatError", errorMessages.NOTREGISTERED));
		let ret = await this.wsChatService.unbanUser(sender, unbanForm);
		if (ret === -1)
			return (client.emit("ChatError", errorMessages.CHANNELDONTEXIST));
		if (ret === -2)
			return (client.emit("ChatError", errorMessages.INVALIDNAME));
		if (ret === -3)
			return (client.emit("ChatError", errorMessages.INVALIDNAME));
		if (ret === -4)
			return (client.emit("ChatError", errorMessages.NOTOP));
		if (ret === -5)
			return (client.emit("ChatError", errorMessages.NOTBAN));
		let response =
		{
			message : `You successfully unbanned user ${unbanForm.name} !`,
			user : unbanForm.name,
		}
		client.emit("unbanuser", response);
	}

	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('muteuser')
	async muteUser(client: Socket, muteForm: sanctionOperationDto)
	{
		console.log("Mute user ");
		console.log(muteForm.name);
		let sender : number | undefined;
		if ((sender = this.wsChatService.isRegistered(client)) === undefined)
			return (client.emit("ChatError", errorMessages.NOTREGISTERED));
		let ret = await this.wsChatService.muteUser(sender, muteForm);
		if (ret === -1)
			return (client.emit("ChatError", errorMessages.CHANNELDONTEXIST));
		if (ret === -2)
			return (client.emit("ChatError", errorMessages.INVALIDNAME));
		if (ret === -3)
			return (client.emit("ChatError", errorMessages.INVALIDNAME));
		if (ret === -4)
			return (client.emit("ChatError", errorMessages.NOTOP));
		if (ret === -5)
			return (client.emit("ChatError", errorMessages.CANTSANCTIONOWNER));
		if (ret === -6)
			return (client.emit("ChatError", errorMessages.CANTSANCTIONEQUAL));
		if (ret === -7)
			return (client.emit("ChatError", errorMessages.NOTINTHISCHANNEL));
		if (ret === -8)
			return (client.emit("ChatError", errorMessages.ALREADYMUTE));

		let response =
		{
			message : `You successfully muted user ${muteForm.name} !`,
			user : muteForm.name,
		}
		client.emit("muteuser", response);
	}

	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('unmuteuser')
	async unmuteUser(client: Socket, unmuteForm: sanctionOperationDto)
	{
		console.log("Unmute user ");
		console.log(unmuteForm.name);
		let sender : number | undefined;
		if ((sender = this.wsChatService.isRegistered(client)) === undefined)
			return (client.emit("ChatError", errorMessages.NOTREGISTERED));
		let ret = await this.wsChatService.unmuteUser(sender, unmuteForm);
		if (ret === -1)
			return (client.emit("ChatError", errorMessages.CHANNELDONTEXIST));
		if (ret === -2)
			return (client.emit("ChatError", errorMessages.INVALIDNAME));
		if (ret === -3)
			return (client.emit("ChatError", errorMessages.INVALIDNAME));
		if (ret === -4)
			return (client.emit("ChatError", errorMessages.NOTOP));
		if (ret === -5)
			return (client.emit("ChatError", errorMessages.NOTMUTE));
		let response =
		{
			message : `You successfully unmuted user ${unmuteForm.name} !`,
			user : unmuteForm.name,
		}
		client.emit("unmuteuser", response);
	}
}
