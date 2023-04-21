import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection} from '@nestjs/websockets';
import { UsePipes, ValidationPipe, UseGuards, UseFilters } from '@nestjs/common';
import { Socket } from 'socket.io';

import { SocketGuard } from '../guard/socket.guard';

import { sendError, sendSuccess } from '../../common/response';
import { errorMessages } from '../../common/global';

import { WsChatService }  from './wschat.service';
import { createChannelDto, channelOperationDto, userOperationDto, sanctionOperationDto, messageDto, kickDto, directDto, invitationOperationDto, usernameOperationDto  } from './wschat.entity';

import { WsExceptionFilter } from '../guard/ws.filter'; 

@UseFilters(WsExceptionFilter)
@WebSocketGateway(3632, {cors: true})
export class WsChatGateway implements OnGatewayConnection
{
	constructor(private readonly wsChatService: WsChatService)
	{

	}

	async handleConnection(client: Socket)
    {
		let clientToken = client.handshake.auth.token;
		await this.wsChatService.saveChatSocket(client, clientToken);
    }


	//=======					Channel					=======


	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('createchannel')
	async createChannel(client: Socket, channelForm: createChannelDto)
	{
		let sender : number | undefined;
		if ((sender = this.wsChatService.isRegistered(client)) === undefined)
			return (client.emit("ChatError", errorMessages.NOTREGISTERED));
		let ret = await this.wsChatService.createChannel(sender, channelForm);
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
		let sender : number | undefined;
		if ((sender = this.wsChatService.isRegistered(client)) === undefined)
			return (client.emit("ChatError", errorMessages.NOTREGISTERED));
		let ret = await this.wsChatService.deleteChannel(sender, deleteForm);
		if (ret === -1)
			return (client.emit("ChatError", errorMessages.CHANNELDONTEXIST));
		if (ret === -2)
			return (client.emit("ChatError", errorMessages.INVALIDUSER));
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
		let sender : number | undefined;
		if ((sender = this.wsChatService.isRegistered(client)) === undefined)
			return (client.emit("ChatError", errorMessages.NOTREGISTERED));
		let ret = await this.wsChatService.joinChannel(sender, joinForm);
		if (ret === -1)
			return (client.emit("ChatError", errorMessages.CHANNELDONTEXIST));
		if (ret === -2)
			return (client.emit("ChatError", errorMessages.INVALIDUSER));
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
		let sender : number | undefined;
		if ((sender = this.wsChatService.isRegistered(client)) === undefined)
			return (client.emit("ChatError", errorMessages.NOTREGISTERED));
		let ret = await this.wsChatService.leaveChannel(sender, leaveForm);
		if (ret === -1)
			return (client.emit("ChatError", errorMessages.CHANNELDONTEXIST));
		if (ret === -2)
			return (client.emit("ChatError", errorMessages.INVALIDUSER));
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
		let sender : number | undefined;
		if ((sender = this.wsChatService.isRegistered(client)) === undefined)
			return (client.emit("ChatError", errorMessages.NOTREGISTERED));
		let ret = await this.wsChatService.channelMessage(sender, messageForm);
		if (ret === -1)
			return (client.emit("ChatError", errorMessages.CHANNELDONTEXIST));
		if (ret === -2)
			return (client.emit("ChatError", errorMessages.INVALIDUSER));
		if (ret === -3)
			return (client.emit("ChatError", errorMessages.NOTJOINED));
		if (ret === -4)
			return (client.emit("ChatError", errorMessages.YOUAREMUTE));
	}

	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('changepassword')
	async changePassword(client: Socket, changeForm: channelOperationDto)
	{
		let sender : number | undefined;
		if ((sender = this.wsChatService.isRegistered(client)) === undefined)
			return (client.emit("ChatError", errorMessages.NOTREGISTERED));
		let ret = await this.wsChatService.changePassword(sender, changeForm);
		if (ret === -1)
			return (client.emit("ChatError", errorMessages.CHANNELDONTEXIST));
		if (ret === -2)
			return (client.emit("ChatError", errorMessages.INVALIDUSER));
		if (ret === -3)
			return (client.emit("ChatError", errorMessages.NOTTHEOWNER));
		if (ret === -4)
			return (client.emit("ChatError", errorMessages.INCORRECTVISIBILITY));
	}


	//=======					User					=======


	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('addadmin')
	async addAdmin(client: Socket, adminForm: usernameOperationDto)
	{
		let sender : number | undefined;
		if ((sender = this.wsChatService.isRegistered(client)) === undefined)
			return (client.emit("ChatError", errorMessages.NOTREGISTERED));
		let ret = await this.wsChatService.addAdmin(sender, adminForm);
		if (ret === -1)
			return (client.emit("ChatError", errorMessages.CHANNELDONTEXIST));
		if (ret === -2)
			return (client.emit("ChatError", errorMessages.INVALIDUSER));
		if (ret === -3)
			return (client.emit("ChatError", errorMessages.NOTTHEOWNER));
		if (ret === -4)
			return (client.emit("ChatError", errorMessages.INVALIDNAME));
		if (ret === -5)
			return (client.emit("ChatError", errorMessages.NOTINTHISCHANNEL));
		if (ret === -6)
			return (client.emit("ChatError", errorMessages.ALREADYADMIN));
		client.emit("addadmin", `User ${ret} successfully promoted to administrator !`);
	}

	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('removeadmin')
	async removeAdmin(client: Socket, adminForm: usernameOperationDto)
	{
		let sender : number | undefined;
		if ((sender = this.wsChatService.isRegistered(client)) === undefined)
			return (client.emit("ChatError", errorMessages.NOTREGISTERED));
		let ret = await this.wsChatService.removeAdmin(sender, adminForm);
		if (ret === -1)
			return (client.emit("ChatError", errorMessages.CHANNELDONTEXIST));
		if (ret === -2)
			return (client.emit("ChatError", errorMessages.INVALIDUSER));
		if (ret === -3)
			return (client.emit("ChatError", errorMessages.NOTTHEOWNER));
		if (ret === -4)
			return (client.emit("ChatError", errorMessages.INVALIDNAME));
		if (ret === -5)
			return (client.emit("ChatError", errorMessages.NOTINTHISCHANNEL));
		if (ret === -6)
			return (client.emit("ChatError", errorMessages.NOTANADMINISTRATOR));
		if (ret === -7)
			return (client.emit("ChatError", errorMessages.CANTDEMOTEOWNER));
		client.emit("removeadmin", `User ${ret} successfully demoted from administrator !`);
	}

	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('createinvitation')
	async createInvitation(client: Socket, invitationForm: invitationOperationDto)
	{
		let sender : number | undefined;
		if ((sender = this.wsChatService.isRegistered(client)) === undefined)
			return (client.emit("ChatError", errorMessages.NOTREGISTERED));
		let ret = await this.wsChatService.createInvitation(sender, invitationForm);
		if (ret === -1)
			return (client.emit("ChatError", errorMessages.CHANNELDONTEXIST));
		if (ret === -2)
			return (client.emit("ChatError", errorMessages.INVALIDUSER));
		if (ret === -3)
			return (client.emit("ChatError", errorMessages.INVALIDNAME));
		if (ret === -4)
			return (client.emit("ChatError", errorMessages.USERALREADYINCHANNEL));
		if (ret === -5)
			return (client.emit("ChatError", errorMessages.ALREADYINVITED));
		if (ret === -6)
			return (client.emit("ChatError", errorMessages.NOTOP));
		if (ret === -7)
			return (client.emit("ChatError", errorMessages.CANTINVITEONPUBLIC));
		client.emit("createinvitation",
			`User ${invitationForm.name} has been successfully invited to channel ${invitationForm.channelname}!`);
	}

	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('deleteinvitation')
	async deleteInvitation(client: Socket, invitationForm: invitationOperationDto)
	{
		let sender : number | undefined;
		if ((sender = this.wsChatService.isRegistered(client)) === undefined)
			return (client.emit("ChatError", errorMessages.NOTREGISTERED));
		let ret = await this.wsChatService.deleteInvitation(sender, invitationForm);
		if (ret === -1)
			return (client.emit("ChatError", errorMessages.CHANNELDONTEXIST));
		if (ret === -2)
			return (client.emit("ChatError", errorMessages.INVALIDNAME));
		if (ret === -3)
			return (client.emit("ChatError", errorMessages.INVALIDNAME));
		if (ret === -4)
			return (client.emit("ChatError", errorMessages.NOTINVITED));
		client.emit("deleteinvitation", `You successfully deleted the invitation of ${ret} for channel ${invitationForm.channelname} !`);
	}

	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('usermessage')
	async sendUserMessage(client: Socket, messageForm: directDto)
	{
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
	}

	
	//=======				 Sanction					=======

	
	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('kickuser')
	async kickUser(client: Socket, kickForm: kickDto)
	{
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
			message : `You successfully kicked user ${ret} !`,
			user : ret,
			userId : kickForm.id,
		}
		client.emit("kickuser", response);
	}

	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('banuser')
	async banUser(client: Socket, banForm: sanctionOperationDto)
	{
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
			return (client.emit("ChatError", errorMessages.ALREADYBAN));
		let response =
		{
			message : `You successfully banned user ${ret} !`,
			user : ret,
			userId : banForm.id,
		}
		client.emit("banuser", response);
	}

	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('unbanuser')
	async unbanUser(client: Socket, unbanForm: usernameOperationDto)
	{
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
			message : `You successfully unbanned user ${ret} !`,
			user : unbanForm.name,
		}
		client.emit("unbanuser", response);
	}

	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('muteuser')
	async muteUser(client: Socket, muteForm: sanctionOperationDto)
	{
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
			return (client.emit("ChatError", errorMessages.ALREADYMUTE));

		let response =
		{
			message : `You successfully muted user ${ret} !`,
			user : ret,
			userId : muteForm.id,
		}
		client.emit("muteuser", response);
	}

	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('unmuteuser')
	async unmuteUser(client: Socket, unmuteForm: usernameOperationDto)
	{
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
			message : `You successfully unmuted user ${ret} !`,
			user : unmuteForm.name,
		}
		client.emit("unmuteuser", response);
	}
}
