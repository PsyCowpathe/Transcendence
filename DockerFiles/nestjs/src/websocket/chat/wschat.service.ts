import { Injectable } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';

import { Socket, Server } from 'socket.io';

import { UserService } from '../../db/user/user.service';
import { RelationService } from '../../db/relation/relation.service';
import { ChannelService } from '../../db/chat/channel.service';
import { AdminsService } from '../../db/chat/admins.service';
import { JoinChannelService } from '../../db/chat/joinchannel.service';
import { InviteListService } from '../../db/chat/invitelist.service';
import { BansService } from '../../db/chat/bans.service';
import { MutesService } from '../../db/chat/mutes.service';
import { MessageService } from '../../db/chat/message.service';
import { PrivateService } from '../../db/chat/private.service';

import { createChannelDto, channelOperationDto, userOperationDto, sanctionOperationDto, messageDto } from './wschat.entity';

import { Channel, Admins, JoinChannel, InviteList, Bans, Mutes, Message, Private } from '../../db/chat/chat.entity';
import { User } from '../../db/user/user.entity';

import * as bcrypt from 'bcrypt';

@Injectable()
export class WsChatService
{
	constructor(private readonly userService : UserService,
				private readonly channelService : ChannelService,
			   	private readonly adminsService : AdminsService,
			   	private readonly joinChannelService : JoinChannelService,
				private readonly inviteListService : InviteListService,
				private readonly bansService : BansService,
				private readonly mutesService : MutesService,
				private readonly relationService : RelationService,
				private readonly messageService : MessageService,
				private readonly privateService : PrivateService)
	{

	}

	private sockets = new Map<number, Socket>;

	@WebSocketServer()
	io: Server;


	//=======					Utility					=======


	async saveChatSocket(client: Socket, token: string)
	{
		let user = await this.userService.findOneByToken(token);
		if (user !== null)
		{
			await this.sockets.set(user.id, client);
			console.log("New socket saved : " + user.name);
			await this.updateRoom(user, client);
		}
	}

	async updateRoom(user: User, client: Socket)
	{
		console.log("user : " + user.name + " subscribed to channel");
		let joinedChannel = await this.joinChannelService.getJoinedChannel(user);
		if (joinedChannel === null)
			return ;
		let i = 0;
		let list = [];
		while (joinedChannel[i])
		{
			list.push(joinedChannel[i].channel.name);
			i++;
		}
		console.log("channellist = ")
		console.log(list);
		client.join(list);
	}

	async userPower(user: User | null, channel: Channel) : Promise<number>
	{
		if (user === null)
			return (-1);
		if (user.id === channel.owner.id)
			return (2);
		if (await this.adminsService.findOneByAdmin(channel, user) !== null)
			return (1);
		return (0);
	}

	isRegistered(socket: Socket)
	{
  		for (let [key, current] of this.sockets.entries())
		{
    		if (current === socket)
      			return key;
  		}
	}

	async isBan(user: User, channel: Channel) : Promise<boolean>
	{
		let banList: any = await this.bansService.findOneByBan(user, channel);
		let i = 0;
		let time = Date.now();
		if (banList === null)
			return (false);
		while (banList[i])
		{
			console.log(banList[i++]);
			if (time < banList[i].end)
				return (true);
		}
		return (false);
	}

	async isMute(user: User, channel: Channel) : Promise<boolean>
	{
		let muteList: any = await this.mutesService.findOneByMute(user, channel);
		let i = 0;
		let time = Date.now();
		if (muteList === null)
			return (false);
		while (muteList[i])
		{
			console.log(muteList[i++]);
			if (time < muteList[i].end)
				return (true);
		}
		return (false);
	}

	async getUserInChannel(channel: Channel) : Promise<JoinChannel[] | null>
	{
		return (this.joinChannelService.getUser(channel));
	}

	notifyChannel(socket: Socket | undefined, destination: string, message: string, data: string) : number
	{
		console.log(destination);
		if (socket)
			socket.to(destination).emit(message, data);
		return (1);
	}

	notifyUser(userId: number, destination: string, message: string, first_data: any, second_data?: any)
	{
		let userSocket = this.sockets.get(userId);
		if (userSocket !== undefined)
		{
			let response =
			{
				message: message,
				first_data: first_data,
				second_data: second_data,
			}
			userSocket.emit(destination, response);
		}
		return (1);
	}

	async hashPassword(password: string | undefined) : Promise<string>
	{
		if (password === undefined)
			return ("");
		const saltOrRounds = 10;
		const hashed = await bcrypt.hash(password, saltOrRounds);
		return (hashed);
	}


	//=======					Channel					=======


	async createChannel(sender: number, channelForm: createChannelDto) : Promise<number>
	{
		if (await this.channelService.findOneByName(channelForm.channelname) !== null)
			return (-1);
		if (channelForm.visibility === "private" && channelForm.password !== undefined)
			return (-2);
		let creator = await this.userService.findOneById(sender);
		let cryptedPassword = await this.hashPassword(channelForm.password);
		let newChannel = new Channel();
		newChannel.name = channelForm.channelname;
		if (creator)
			newChannel.owner = creator;
		newChannel.visibility = channelForm.visibility;
		console.log("password");
		console.log(channelForm.password)
		if (channelForm.password !== undefined)
			newChannel.password = cryptedPassword;
		let channel = await this.channelService.create(newChannel);
		let newJoin = new JoinChannel();
		newJoin.channel = channel;
		if (creator)
			newJoin.user = creator;
		await this.joinChannelService.create(newJoin);
		return (1);
	}

	async deleteChannel(sender: number, deleteForm: channelOperationDto) : Promise<number>
	{
		let askMan = await this.userService.findOneById(sender);
		let channel = await this.channelService.findOneByName(deleteForm.channelname);
		if (channel === null)
			return (-1);
		if (askMan === null)
			return (-2);
		if (await this.userPower(askMan, channel) !== 2)
			return (-3);
		await this.channelService.delete(channel);
		let channelMessage = `The channel ${channel.name} has been deleted !`;
		return (this.notifyChannel(this.sockets.get(sender), channel.name, channelMessage, channel.name));
	}


	async joinChannel(sender: number, joinForm: channelOperationDto) : Promise<number>
	{
		let askMan = await this.userService.findOneById(sender);
		let channel = await this.channelService.findOneByName(joinForm.channelname);
		if (channel === null)
			return (-1);
		if (askMan === null)
			return (-2);
		if (await this.joinChannelService.findOneByJoined(channel, askMan) !== null)
			return (-3)
		if (await this.isBan(askMan, channel) === true)
			return (-4)
		if (channel.visibility === "public")
		{
			if (channel.password !== null)
			{
				const isMatch = await bcrypt.compare(joinForm.password, channel.password);
				if (isMatch === false)
					return (-5);
			}
			let newJoin = new JoinChannel();
			newJoin.channel = channel;
			if (askMan)
				newJoin.user = askMan;
			await this.joinChannelService.create(newJoin);
		}
		else
		{
			if (await this.inviteListService.findOneByInvite(channel, askMan) === null)
				return (-6);
			let newJoin = new JoinChannel();
			newJoin.channel = channel;
			if (askMan)
				newJoin.user = askMan;
			await this.joinChannelService.create(newJoin);
		}
		let userSocket = this.sockets.get(askMan.id);
		if (userSocket)
			userSocket.join(channel.name);
		let channelMessage = `User ${askMan.name} joined the channel !`;
		let userMessage = `The list of user in this channel :`;
		this.notifyUser(askMan.id, "joinchannel", userMessage, channel.name, this.getUserInChannel(channel));
		return (this.notifyChannel(this.sockets.get(sender), channel.name, channelMessage, askMan.name));
	}

	async leaveChannel(sender: number, leaveForm: channelOperationDto) : Promise<number>
	{
		let askMan = await this.userService.findOneById(sender);
		let channel = await this.channelService.findOneByName(leaveForm.channelname);
		if (channel === null)
			return (-1);
		if (askMan === null)
			return (-2);
		if (await this.joinChannelService.findOneByJoined(channel, askMan) === null)
			return (-3);
		if (await this.userPower(askMan, channel) === 2)
			return (-4);
		await this.joinChannelService.remove(askMan, channel);
		let channelMessage = `User ${askMan.name} leaved the channel !`;
		return (this.notifyChannel(this.sockets.get(sender), channel.name, channelMessage, askMan.name));
	}

	async channelMessage(sender: number, messageForm: messageDto) : Promise<number>
	{
		let askMan = await this.userService.findOneById(sender);
		let channel = await this.channelService.findOneByName(messageForm.destination);
		if (channel === null)
			return (-1);
		if (askMan === null)
			return (-2);
		if (await this.joinChannelService.findOneByJoined(channel, askMan) === null)
			return (-3);
		if (await this.isMute(askMan, channel) === true)
			return (-4);
		let annoyedUserList : any = await this.relationService.getAnnoyedUser(askMan);
		let userSocket = await this.sockets.get(askMan.id);
		if (userSocket === undefined)
			return (1);
		let newMessage = new Message();
		newMessage.channel = channel;
		newMessage.sender = askMan;
		newMessage.message = messageForm.message;
		this.messageService.create(newMessage);
		let excludedUser;
		let i = 0;
		while (annoyedUserList && annoyedUserList[i])
		{
			excludedUser = await this.sockets.get(annoyedUserList[i].user1.id);
			if (excludedUser)
				excludedUser.join("exclusionList");
			i++;
		}
		userSocket.to(messageForm.destination).except("exclusionList").emit("channelmsg", {channel: channel.name, user: askMan.name, message : messageForm.message});
		userSocket.in("exclusionList").socketsLeave("exclusionList");
		return (1);
	}


	//=======					User					=======


	async addAdmin(sender: number, adminForm: userOperationDto) : Promise<number>
	{
		let askMan = await this.userService.findOneById(sender);
		let toPromote = await this.userService.findOneByName(adminForm.name);
		let channel = await this.channelService.findOneByName(adminForm.channelname);
		if (channel === null)
			return (-1);
		if (await this.userPower(askMan, channel) !== 2)
			return (-2);
		if (toPromote === null)
			return (-3);
		if (await this.joinChannelService.findOneByJoined(channel, toPromote) === null)
			return (-4)
		if (await this.userPower(toPromote, channel) > 0)
			return (-5);
		let newAdmin = new Admins();
		newAdmin.channel = channel;
		newAdmin.user = toPromote;
		await this.adminsService.create(newAdmin);
		let channelMessage = `User ${toPromote.name} is now an administrator !`;
		let userMessage = `Congratulation you have been promoted !`;
		this.notifyUser(toPromote.id, "addadmin", userMessage, channel.name);
		return (this.notifyChannel(this.sockets.get(sender), channel.name, channelMessage, toPromote.name));
	}

	async removeAdmin(sender: number, adminForm: userOperationDto) : Promise<number>
	{
		let askMan = await this.userService.findOneById(sender);
		let toDemote = await this.userService.findOneByName(adminForm.name);
		let channel = await this.channelService.findOneByName(adminForm.channelname);
		if (channel === null)
			return (-1);
		if (await this.userPower(askMan, channel) !== 2)
			return (-2);
		if (toDemote === null)
			return (-3);
		if (await this.joinChannelService.findOneByJoined(channel, toDemote) === null)
			return (-4)
		if (await this.userPower(toDemote, channel) === 0)
			return (-5);
		this.adminsService.remove(toDemote, channel);
		let channelMessage = `User ${toDemote.name} is now an administrator !`;
		let userMessage = `You are no longer administrator of this channel !`;
		this.notifyUser(toDemote.id, "removeadmin", userMessage, channel.name);
		return (this.notifyChannel(this.sockets.get(sender), channel.name, channelMessage, toDemote.name));

	}

	async createInvitation(sender: number, inviteForm: userOperationDto) : Promise<number>
	{
		let askMan = await this.userService.findOneById(sender);
		let toInvite = await this.userService.findOneByName(inviteForm.name);
		let channel = await this.channelService.findOneByName(inviteForm.channelname);
		if (channel === null)
			return (-1);
		if (askMan === null)
			return (-2);
		if (toInvite === null)
			return (-3);
		if (await this.joinChannelService.findOneByJoined(channel, toInvite) !== null)
			return (-4);
		if (await this.inviteListService.findOneByInvite(channel, toInvite) !== null)
			return (-5);
		if (await this.userPower(askMan, channel) === 0)
			return (-6);
		let newInvite = new InviteList();
		newInvite.channel = channel;
		newInvite.user = toInvite;
		await this.inviteListService.create(newInvite);
		let userMessage = `User ${askMan.name} invited you to join channel ${channel.name} !`;
		return (this.notifyUser(toInvite.id, "createinvitation", userMessage, channel.name));
	}

	async deleteInvitation(sender: number, inviteForm: userOperationDto) : Promise<number>
	{
		let askMan = await this.userService.findOneById(sender);
		let toUninvite = await this.userService.findOneByName(inviteForm.name);
		let channel = await this.channelService.findOneByName(inviteForm.channelname);
		if (channel === null)
			return (-1);
		if (askMan === null)
			return (-2);
		if (toUninvite === null)
			return (-3);
		if (await this.inviteListService.findOneByInvite(channel, toUninvite) === null)
			return (-4);
		await this.inviteListService.remove(toUninvite, channel);
		let userMessage = `Your invitation to join channel ${channel.name} has been revoked !`;
		return (this.notifyUser(toUninvite.id, "deleteinvitation", userMessage, channel.name));
	}

	async userMessage(sender: number, messageForm: messageDto) : Promise<number>
	{
		let askMan = await this.userService.findOneById(sender);
		let receiver = await this.userService.findOneByName(messageForm.destination);
		if (askMan === null)
			return (-1);
		if (receiver === null)
			return (-2);
		let ret = await this.relationService.getRelationStatus(askMan, receiver);
		if (ret === "VX")
			return (-3);
		if (ret === "XV" || ret === "enemy")
			return (-4);
		let newPrivate = new Private();
		newPrivate.user1 = askMan;
		newPrivate.user2 = receiver;
		newPrivate.message = messageForm.message;
		this.privateService.create(newPrivate);
		return (this.notifyUser(receiver.id, "messageuser", messageForm.message, askMan.name));
	}


	//=======					Sanction					=======


	async kickUser(sender: number, kickForm: sanctionOperationDto) : Promise<number>
	{
		let askMan = await this.userService.findOneById(sender);
		let toKick = await this.userService.findOneByName(kickForm.name)
		let channel = await this.channelService.findOneByName(kickForm.channelname);
		if (channel === null)
			return (-1);
		if (askMan === null)
			return (-2);
		if (toKick === null)
			return (-3);
		let askManPower = await this.userPower(askMan, channel)
		let toKickPower = await this.userPower(toKick, channel)
		if (askManPower === 0)
			return (-4);
		if (toKickPower === 2)
			return (-5);
		if (askManPower === toKickPower)
			return (-6);
		if (await this.joinChannelService.findOneByJoined(channel, toKick) === null)
			return (-7);
		await this.joinChannelService.remove(toKick, channel);
		let channelMessage = `User ${toKick.name} has been kicked !`;
		let userMessage = `You have been kicked from channel ${channel.name} for : ${kickForm.reason} !`;
		this.notifyUser(toKick.id, "kickuser", userMessage, channel.name);
		return (this.notifyChannel(this.sockets.get(sender), channel.name, channelMessage, toKick.name));
	}

	async banUser(sender: number, banForm: sanctionOperationDto) : Promise<number>
	{
		let askMan = await this.userService.findOneById(sender);
		let toBan = await this.userService.findOneByName(banForm.name)
		let channel = await this.channelService.findOneByName(banForm.channelname);
		if (channel === null)
			return (-1);
		if (askMan === null)
			return (-2);
		if (toBan === null)
			return (-3);
		let askManPower = await this.userPower(askMan, channel)
		let toBanPower = await this.userPower(toBan, channel)
		if (askManPower === 0)
			return (-4);
		if (toBanPower === 2)
			return (-5);
		if (askManPower === toBanPower)
			return (-6);
		if (await this.joinChannelService.findOneByJoined(channel, toBan) === null)
			return (-7);
		if (await this.isBan(toBan, channel) === true)
			return (-8);
		let newBan = new Bans();
		newBan.channel = channel;
		newBan.user = toBan;
		newBan.end = (Date.now() + (banForm.time * 60 * 1000)).toString();
		newBan.reason = banForm.reason;
		await this.bansService.create(newBan);
		await this.joinChannelService.remove(toBan, channel);
		let channelMessage = `User ${toBan.name} has been banned !`;
		let userMessage = `${Date.now()}: You have been banned from channel ${channel.name} for ${banForm.time} minutes for reason ${banForm.reason} !`;
		this.notifyUser(toBan.id, "banuser", userMessage, channel.name);
		return (this.notifyChannel(this.sockets.get(sender), channel.name, channelMessage, toBan.name));
	}

	async unbanUser(sender: number, unbanForm: sanctionOperationDto) : Promise<number>
	{
		let askMan = await this.userService.findOneById(sender);
		let toUnban = await this.userService.findOneByName(unbanForm.name)
		let channel = await this.channelService.findOneByName(unbanForm.channelname);
		if (channel === null)
			return (-1);
		if (askMan === null)
			return (-2);
		if (toUnban === null)
			return (-3);
		let askManPower = await this.userPower(askMan, channel)
		if (askManPower === 0)
			return (-4);
		if (await this.isBan(toUnban, channel) === false)
			return (-5);
		this.bansService.updateBanEnd(toUnban, channel, Date.now().toString());
		let channelMessage = `User ${toUnban.name} has been unbanned !`;
		let userMessage = `You have been unbanned from channel ${channel.name} !`;
		this.notifyUser(toUnban.id, "unbanuser", userMessage, channel.name);
		return (this.notifyChannel(this.sockets.get(sender), channel.name, channelMessage, toUnban.name));
	}

	async muteUser(sender: number, muteForm: sanctionOperationDto) : Promise<number>
	{
		let askMan = await this.userService.findOneById(sender);
		let toMute = await this.userService.findOneByName(muteForm.name)
		let channel = await this.channelService.findOneByName(muteForm.channelname);
		if (channel === null)
			return (-1);
		if (askMan === null)
			return (-2);
		if (toMute === null)
			return (-3);
		let askManPower = await this.userPower(askMan, channel)
		let toMutePower = await this.userPower(toMute, channel)
		if (askManPower === 0)
			return (-4);
		if (toMutePower === 2)
			return (-5);
		if (askManPower === toMutePower)
			return (-6);
		if (await this.joinChannelService.findOneByJoined(channel, toMute) === null)
			return (-7);
		if (await this.isMute(toMute, channel) === true)
			return (-8);
		let newMute = new Mutes();
		newMute.channel = channel;
		newMute.user = toMute;
		newMute.end = (Date.now() + (muteForm.time * 60 * 1000)).toString();
		newMute.reason = muteForm.reason;
		await this.mutesService.create(newMute);
		let channelMessage = `User ${toMute.name} has been muted !`;
		let userMessage = `${Date.now()}: You have been muted for ${muteForm.time} minutes for reason ${muteForm.reason} !`;
		this.notifyUser(toMute.id, "muteuser", userMessage, channel.name);
		return (this.notifyChannel(this.sockets.get(sender), channel.name, channelMessage, toMute.name));
	}

	async unmuteUser(sender: number, unmuteForm: sanctionOperationDto) : Promise<number>
	{
		let askMan = await this.userService.findOneById(sender);
		let toUnmute = await this.userService.findOneByName(unmuteForm.name)
		let channel = await this.channelService.findOneByName(unmuteForm.channelname);
		if (channel === null)
			return (-1);
		if (askMan === null)
			return (-2);
		if (toUnmute === null)
			return (-3);
		let askManPower = await this.userPower(askMan, channel)
		if (askManPower === 0)
			return (-4);
		if (await this.isMute(toUnmute, channel) === false)
			return (-5);
		this.mutesService.updateMuteEnd(toUnmute, channel, Date.now().toString());
		let channelMessage = `User ${toUnmute.name} has been unmuted !`;
		let userMessage = `You have been unmuted from channel ${channel.name} !`;
		this.notifyUser(toUnmute.id, "unmuteuser", userMessage, channel.name);
		return (this.notifyChannel(this.sockets.get(sender), channel.name, channelMessage, toUnmute.name));
	}


}
