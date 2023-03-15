import { Injectable } from '@nestjs/common';

import { Socket } from 'socket.io';

import { UserService } from '../../db/user/user.service';
import { ChannelService } from '../../db/chat/channel.service';
import { AdminsService } from '../../db/chat/admins.service';
import { JoinChannelService } from '../../db/chat/joinchannel.service';
import { InviteListService } from '../../db/chat/invitelist.service';

import { createChannelDto, adminOperationDto, channelOperationDto, inviteOperationDto } from './wschat.entity';

import { Channel, Admins, JoinChannel, InviteList } from '../../db/chat/chat.entity';

import * as bcrypt from 'bcrypt';

@Injectable()
export class WsChatService
{
	constructor(private readonly userService : UserService,
				private readonly channelService : ChannelService,
			   	private readonly adminsService : AdminsService,
			   	private readonly joinChannelService : JoinChannelService,
				private readonly inviteListService : InviteListService)
	{

	}

	private sockets = new Map<number, Socket>;

	async saveChatSocket(client: Socket, token: string)
	{
		let user = await this.userService.findOneByToken(token);
		if (user !== null)
		{
			this.sockets.set(user.id, client);
			console.log("New socket saved : " + user.name);
		}
	}

	isRegistered(socket: Socket)
	{
  		for (let [key, current] of this.sockets.entries())
		{
    		if (current === socket)
      			return key;
  		}
	}

	async hashPassword(password: string) : Promise<string>
	{
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
		this.joinChannelService.create(newJoin);
		return (1);
	}

	async addAdmin(sender: number, adminForm: adminOperationDto) : Promise<number>
	{
		let toPromote = await this.userService.findOneByName(adminForm.name);
		let channel = await this.channelService.findOneByName(adminForm.channelname);
		if (channel === null)
			return (-1);
		if (channel.owner.id !== sender)
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
		this.adminsService.create(newAdmin);
		return (1);
	}

	async removeAdmin(sender: number, adminForm: adminOperationDto) : Promise<number>
	{
		let toDemote = await this.userService.findOneByName(adminForm.name);
		let channel = await this.channelService.findOneByName(adminForm.channelname);
		if (channel === null)
			return (-1);
		if (channel.owner.id !== sender)
			return (-2);
		if (toDemote === null)
			return (-3);
		if (await this.joinChannelService.findOneByJoined(channel, toDemote) === null)
			return (-4)
		if (await this.adminsService.findOneByAdmin(channel, toDemote) === null)
			return (-5);
		this.adminsService.remove(toDemote, channel);
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
			this.joinChannelService.create(newJoin);
			return (1)
		}
		else
		{
			if (await this.inviteListService.findOneByInvite(channel, askMan) === null)
				return (-5);
			let newJoin = new JoinChannel();
			newJoin.channel = channel;
			if (askMan)
				newJoin.user = askMan;
			this.joinChannelService.create(newJoin);
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
			return (-3)
		await this.joinChannelService.remove(askMan, channel);
		return (1);
	}

	async createInvitation(sender: number, inviteForm: inviteOperationDto) : Promise<number>
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
		if (await this.adminsService.findOneByAdmin(channel, askMan) === null &&
			channel.owner.id !== sender)
			return (-5);
		let newInvite = new InviteList();
		newInvite.channel = channel;
		newInvite.user = toInvite;
		await this.inviteListService.create(newInvite);
		return (1);
	}

	async deleteInvitation(sender: number, inviteForm: inviteOperationDto) : Promise<number>
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
		return (1);
	}

	async deleteChannel(sender: number, deleteForm: channelOperationDto) : Promise<number>
	{
		let askMan = await this.userService.findOneById(sender);
		let channel = await this.channelService.findOneByName(deleteForm.channelname);
		if (channel === null)
			return (-1);
		if (askMan === null) //may be useless
			return (-2);//may be useless
		if (channel.owner.id !== sender)
			return (-3);
		await this.channelService.delete(channel);
		return (1);
	}
}
