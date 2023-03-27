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

	async userPower(askMan: User | null, channel: Channel) : Promise<number>
	{
		if (askMan === null)
			return (-1);
		if (askMan.id === channel.owner.id)
			return (2);
		if (await this.adminsService.findOneByAdmin(channel, askMan) !== null)
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
		if (await this.channelService.findOneByName(channelForm.name) !== null)
			return (-1);
		if (channelForm.visibility === "private" && channelForm.password !== undefined)
			return (-2);
		let creator = await this.userService.findOneById(sender);
		let cryptedPassword = await this.hashPassword(channelForm.password);
		let newChannel = new Channel();
		newChannel.name = channelForm.name;
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
		if (await this.adminsService.findOneByAdmin(channel, toPromote) !== null)
			return (-5);
		let newAdmin = new Admins();
		newAdmin.channel = channel;
		newAdmin.user = toPromote;
		await this.adminsService.create(newAdmin);
		let clientToNotify = this.sockets.get(toPromote.id);
		if (clientToNotify !== undefined)
		{
			let response =
			{
				message : `Congratulation you have been promoted !`,
				channel : channel.name,
			}
			clientToNotify.emit("addadmin", response);
			clientToNotify.to(channel.name)
				.emit(`User ${toPromote.name} is now an administrator !`, toPromote.name);
		}
		return (1);
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
		if (await this.adminsService.findOneByAdmin(channel, toDemote) === null)
			return (-5);
		this.adminsService.remove(toDemote, channel);
		let clientToNotify = this.sockets.get(toDemote.id);
		if (clientToNotify !== undefined)
		{
			let response =
			{
				message : `You are no longer administrator of this channel !`,
				channel : channel.name,
			}
			clientToNotify.emit("addadmin", response);
			clientToNotify.to(channel.name)
				.emit(`User ${toDemote.name} is now an administrator !`, toDemote.name);
		}
		return (1);
	}

	async joinChannel(sender: number, joinForm: channelOperationDto) : Promise<number>
	{
		let askMan = await this.userService.findOneById(sender);
		let channel = await this.channelService.findOneByName(joinForm.channelname);
		if (channel === null)
			return (-1);
		if (askMan === null)//may be useless
			return (-2);//may be useless
		if (await this.joinChannelService.findOneByJoined(channel, askMan) === null)
			return (-3)
		if (channel.visibility === "public")
		{
			const isMatch = await bcrypt.compare(joinForm.password, channel.password);
			if (isMatch === false)
				return (-4);
			let newJoin = new JoinChannel();
			newJoin.channel = channel;
			if (askMan)
				newJoin.user = askMan;
			await this.joinChannelService.create(newJoin);
		}
		else
		{
			if (await this.inviteListService.findOneByInvite(channel, askMan) === null)
				return (-5);
			let newJoin = new JoinChannel();
			newJoin.channel = channel;
			if (askMan)
				newJoin.user = askMan;
			await this.joinChannelService.create(newJoin);
		}
		let clientToNotNotify = this.sockets.get(askMan.id);
		if (clientToNotNotify !== undefined)
		{
			clientToNotNotify.to(channel.name)
				.emit(`User ${askMan.name} joined the channel !`, askMan.name);
		}
		return (1);
	}

	async leaveChannel(sender: number, leaveForm: channelOperationDto) : Promise<number>
	{
		let askMan = await this.userService.findOneById(sender);
		let channel = await this.channelService.findOneByName(leaveForm.channelname);
		if (channel === null)
			return (-1);
		if (askMan === null) //may be useless
			return (-2);//may be useless
		if (await this.joinChannelService.findOneByJoined(channel, askMan) === null)
			return (-3);
		if (await this.userPower(askMan, channel) === 2)
			return (-4);
		await this.joinChannelService.remove(askMan, channel);
		let clientToNotify = this.sockets.get(askMan.id);
		if (clientToNotify !== undefined)
		{
			clientToNotify.to(channel.name)
				.emit(`User ${askMan.name} leaved the channel !`, askMan.name);
		}
		return (1);
	}

	async createInvitation(sender: number, inviteForm: userOperationDto) : Promise<number>
	{
		let askMan = await this.userService.findOneById(sender);
		let toInvite = await this.userService.findOneByName(inviteForm.name);
		let channel = await this.channelService.findOneByName(inviteForm.channelname);
		if (channel === null)
			return (-1);
		if (askMan === null) //may be useless
			return (-2);//may be useless
		if (toInvite === null)
			return (-3);
		if (await this.joinChannelService.findOneByJoined(channel, toInvite) !== null)
			return (-4);
		if (await this.userPower(askMan, channel) === 0)
			return (-5);
		let newInvite = new InviteList();
		newInvite.channel = channel;
		newInvite.user = toInvite;
		await this.inviteListService.create(newInvite);
		let clientToNotify = this.sockets.get(toInvite.id);
		if (clientToNotify !== undefined)
		{
			let response =
			{
				message : `User ${askMan.name} invited you to join channel ${channel.name} !`,
				channel : channel.name,
			}
			clientToNotify.emit("createinvitation", response);
		}
		return (1);
	}

	async deleteInvitation(sender: number, inviteForm: userOperationDto) : Promise<number>
	{
		let askMan = await this.userService.findOneById(sender);
		let toUninvite = await this.userService.findOneByName(inviteForm.name);
		let channel = await this.channelService.findOneByName(inviteForm.channelname);
		if (channel === null)
			return (-1);
		if (askMan === null) //may be useless
			return (-2);//may be useless
		if (toUninvite === null)
			return (-3);
		if (await this.inviteListService.findOneByInvite(channel, toUninvite) === null)
			return (-4);
		await this.inviteListService.remove(toUninvite, channel);
		let clientToNotify = this.sockets.get(toUninvite.id);
		if (clientToNotify !== undefined)
		{
			let response =
			{
				message : `Your invitation to join channel ${channel.name} has been revoked !`,
				channel : channel.name,
			}
			clientToNotify.emit("deleteinvitation", response);
		}
		return (1);
	}

	async deleteChannel(sender: number, deleteForm: userOperationDto) : Promise<number>
	{
		let askMan = await this.userService.findOneById(sender);
		let channel = await this.channelService.findOneByName(deleteForm.channelname);
		if (channel === null)
			return (-1);
		if (askMan === null) //may be useless
			return (-2);//may be useless
		if (await this.userPower(askMan, channel) !== 2)
			return (-3);
		await this.channelService.delete(channel);
		let clientToNotify = this.sockets.get(askMan.id);
		if (clientToNotify !== undefined)
		{
			clientToNotify.to(channel.name)
				.emit(`The channel ${channel.name} has been deleted !`, channel.name);
		}
		return (1);
	}

	async kickUser(sender: number, kickForm: sanctionOperationDto) : Promise<number>
	{
		let askMan = await this.userService.findOneById(sender);
		let toKick = await this.userService.findOneByName(kickForm.name)
		let channel = await this.channelService.findOneByName(kickForm.channelname);
		if (channel === null)
			return (-1);
		if (askMan === null) //may be useless
			return (-2);//may be useless
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
		let clientToNotify = this.sockets.get(toKick.id);
		if (clientToNotify !== undefined)
		{
			let response =
			{
				message : `You have been kicked from channel ${channel.name} for : ${kickForm.reason} !`,
				channel : channel.name,
			}
			clientToNotify.emit("kick", response);
			clientToNotify.to(channel.name).emit(`User ${toKick.name} has been kicked !`, toKick.name);
		}
		return (1);
	}

	async BanUser(sender: number, banForm: sanctionOperationDto) : Promise<number>
	{
		let askMan = await this.userService.findOneById(sender);
		let toBan = await this.userService.findOneByName(banForm.name)
		let channel = await this.channelService.findOneByName(banForm.channelname);
		if (channel === null)
			return (-1);
		if (askMan === null) //may be useless
			return (-2);//may be useless
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
		let newBan = new Bans();
		newBan.channel = channel;
		newBan.user = toBan;
		newBan.end = Date.now() + (banForm.time * 60 * 1000)
		newBan.reason = banForm.reason;
		await this.bansService.create(newBan);
		await this.joinChannelService.remove(toBan, channel);
		let clientToNotify = this.sockets.get(toBan.id);
		if (clientToNotify !== undefined)
		{
			let response =
			{
				message : `${Date.now()}: You have been banned from channel ${channel.name} for ${banForm.time} minutes for reason ${banForm.reason} !`,
				channel : channel.name,
			}
			clientToNotify.emit("kick", response);
			clientToNotify.to(channel.name).emit(`User ${toBan.name} has been banned !`, toBan.name);
		}
		return (1);
	}

	async MuteUser(sender: number, muteForm: sanctionOperationDto) : Promise<number>
	{
		let askMan = await this.userService.findOneById(sender);
		let toMute = await this.userService.findOneByName(muteForm.name)
		let channel = await this.channelService.findOneByName(muteForm.channelname);
		if (channel === null)
			return (-1);
		if (askMan === null) //may be useless
			return (-2);//may be useless
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
		let newMute = new Mutes();
		newMute.channel = channel;
		newMute.user = toMute;
		newMute.end = Date.now() + (muteForm.time * 60 * 1000)
		newMute.reason = muteForm.reason;
		await this.mutesService.create(newMute);
		let clientToNotify = this.sockets.get(toMute.id);
		if (clientToNotify !== undefined)
		{
			let response =
			{
				message : `${Date.now()}: You have been muted for ${muteForm.time} minutes for reason ${muteForm.reason} !`,
				channel : channel.name,
			}
			clientToNotify.emit("mute", response);
			clientToNotify.to(channel.name).emit(`User ${toMute.name} has been muted !`, toMute.name);
		}

		return (1);
	}
}
