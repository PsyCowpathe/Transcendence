import { Injectable } from '@nestjs/common';

import { Socket } from 'socket.io';

import { UserService } from '../../db/user/user.service';
import { ChannelService } from '../../db/chat/channel.service';
import { AdminsService } from '../../db/chat/admins.service';
import { JoinChannelService } from '../../db/chat/joinchannel.service';
import { InviteListService } from '../../db/chat/invitelist.service';
import { BansService } from '../../db/chat/bans.service';
import { MutesService } from '../../db/chat/mutes.service';

import { createChannelDto, channelOperationDto, userOperationDto, sanctionOperationDto } from './wschat.entity';

import { Channel, Admins, JoinChannel, InviteList, Bans, Mutes } from '../../db/chat/chat.entity';
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
				private readonly mutesService : MutesService)
	{

	}

	private sockets = new Map<number, Socket>;

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
		let joinedChannel = await this.joinChannelService.getJoinedChannel(user);
		if (joinedChannel === null)
			return ;
		let list = joinedChannel.map(function(id) { return id['id'] });
		client.join(list.toString());
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

	Notify(userId: number, channelMessage: string | undefined, data: any, destination: any, userMessage: string | undefined) : number
	{
		let userSocket = this.sockets.get(userId);
		if (userSocket !== undefined)
		{
			let response =
			{
				message : userMessage,
				first_data : data.first,
				second_data : data.second,
			}
			if (channelMessage !== undefined)
				userSocket.to(destination.channel).emit(channelMessage, data);
			if (userMessage !== undefined)
				userSocket.emit(destination.user, response);
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
		newChannel.password = cryptedPassword;
		let channel = await this.channelService.create(newChannel);
		let newJoin = new JoinChannel();
		newJoin.channel = channel;
		if (creator)
			newJoin.user = creator;
		await this.joinChannelService.create(newJoin);
		return (1);
	}

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
		return (this.Notify(toPromote.id, channelMessage, toPromote.name, {channel: channel.name, user: "addadmin"}, userMessage));
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
		return (this.Notify(toDemote.id, channelMessage, toDemote.name, {channel: channel.name, user: "removeadmin"}, userMessage));
	}

	async joinChannel(sender: number, joinForm: channelOperationDto) : Promise<number>
	{
		let askMan = await this.userService.findOneById(sender);
		let channel = await this.channelService.findOneByName(joinForm.channelname);
		if (channel === null)
			return (-1);
		if (askMan === null)
			return (-2);
		if (await this.joinChannelService.findOneByJoined(channel, askMan) === null)
			return (-3)
		if (await this.isBan(askMan, channel) === true)
			return (-4)
		if (channel.visibility === "public")
		{
			const isMatch = await bcrypt.compare(joinForm.password, channel.password);
			if (isMatch === false)
				return (-5);
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
		let channelMessage = `User ${askMan.name} joined the channel !`;
		let userMessage = undefined;
		return (this.Notify(askMan.id, channelMessage,
				{first: channel.name, second: this.getUserInChannel(channel)},
				{channel: channel.name, user: "joinchannel"}, userMessage));
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
		let userMessage = undefined;
		return (this.Notify(askMan.id, channelMessage, askMan.name, {channel: channel.name, user: "none"}, userMessage));
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
		let channelMessage = undefined;
		let userMessage = `User ${askMan.name} invited you to join channel ${channel.name} !`;
		return (this.Notify(toInvite.id, channelMessage, "none", {channel: "none", user: "createinvitation"}, userMessage));
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
		let channelMessage = undefined;
		let userMessage = `Your invitation to join channel ${channel.name} has been revoked !`;
		return (this.Notify(toUninvite.id, channelMessage, "none", {channel: "none", user: "deleteinvitation"}, userMessage));
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
		let userMessage = "none";
		return (this.Notify(askMan.id, channelMessage, channel.name, {channel: channel.name, user: "none"}, userMessage));
		return (1);
	}

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
		return (this.Notify(toKick.id, channelMessage, toKick.name, {channel: channel.name, user: "kickuser"}, userMessage));
	}

	async BanUser(sender: number, banForm: sanctionOperationDto) : Promise<number>
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
		newBan.end = Date.now() + (banForm.time * 60 * 1000)
		newBan.reason = banForm.reason;
		await this.bansService.create(newBan);
		await this.joinChannelService.remove(toBan, channel);
		let channelMessage = `User ${toBan.name} has been banned !`;
		let userMessage = `${Date.now()}: You have been banned from channel ${channel.name} for ${banForm.time} minutes for reason ${banForm.reason} !`;
		return (this.Notify(toBan.id, channelMessage, toBan.name, {channel: channel.name, user: "banuser"}, userMessage));
	}

	async MuteUser(sender: number, muteForm: sanctionOperationDto) : Promise<number>
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
		newMute.end = Date.now() + (muteForm.time * 60 * 1000)
		newMute.reason = muteForm.reason;
		await this.mutesService.create(newMute);
		let channelMessage = `User ${toMute.name} has been muted !`;
		let userMessage = `${Date.now()}: You have been muted for ${muteForm.time} minutes for reason ${muteForm.reason} !`;
		return (this.Notify(toMute.id, channelMessage, toMute.name, {channel: channel.name, user: "muteuser"}, userMessage));
	}
}
