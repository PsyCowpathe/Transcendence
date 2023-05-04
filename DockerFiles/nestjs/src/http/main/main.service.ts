import { Injectable } from '@nestjs/common';

import { UserService } from '../../db/user/user.service';
import { ChannelService } from '../../db/chat/channel.service';
import { MessageService } from '../../db/chat/message.service';
import { PrivateService } from '../../db/chat/private.service';
import { JoinChannelService } from '../../db/chat/joinchannel.service';
import { RelationService } from '../../db/relation/relation.service';
import { InviteListService } from '../../db/chat/invitelist.service';
import { GameService } from '../../db/game/game.service';
import { User } from '../../db/user/user.entity';

import * as fs from 'fs';

@Injectable()
export class MainService
{
	constructor(private readonly userService : UserService,
				private readonly channelService : ChannelService,
				private readonly messageService : MessageService,
				private readonly joinChannelService : JoinChannelService,
				private readonly relationService : RelationService,
				private readonly privateService : PrivateService,
				private readonly inviteListService : InviteListService,
				private readonly gameService : GameService,
			   )
	{

	}

	async defineName(name: string, token: string | undefined) : Promise<number>
	{
		let ret = await this.userService.findOneByName(name);
		if (ret !== null)
			return (-1);
		let user = await this.userService.findOneByToken(token);
		if (user !== null)
		{
			await this.userService.updateName(name, user);
			if (user.registered === false)
				await this.userService.updateRegister(true, user);
		}
		return (1);
	}

	async changeAvatar(token: string | undefined, file: Express.Multer.File) : Promise<number>
	{
		if (file.mimetype === 'image/png')
		{
			if (file.buffer[0] !== 0x89 || file.buffer[1] !== 0x50 || file.buffer[2] !== 0x4e
				|| file.buffer[3] !== 0x47 || file.buffer[4] !== 0x0d || file.buffer[5] !== 0x0a
				|| file.buffer[6] !== 0x1a || file.buffer[7] !== 0x0a)
			return (-1);
		}
		else
		{
			if (file.buffer[0] !== 0xff || file.buffer[1] !== 0xd8 || file.buffer[2] !== 0xff)
				return (-1);
		}
		if (file.size > 1500000)
			return (-1);
		const user = await this.userService.findOneByToken(token);
		if (user === null)
			return (-2);
		fs.writeFile("avatars/" + user.uid, file.buffer,
			(err) =>
			{
        		if (err)
					return (-3);
      		});
		return (1);
	}

	async resumeChannel(token: string | undefined, channelName: string) : Promise<number | any>
	{
		const user = await this.userService.findOneByToken(token);
		if (user === null)
			return (-1);
		const channel = await this.channelService.findOneByName(channelName);
		if (channel === null)
			return (-2);
		if (await this.joinChannelService.findOneByJoined(channel, user) === null)
			return (-3);
		const messageList = await this.messageService.findOneByChannel(channel);
		if (messageList === null)
			return (null);
		const annoyingList = await this.relationService.getAnnoyingUser(user);
		let data = [];
		let i = 0;
		while (messageList[i])
		{
			let	j = 0;
			while (annoyingList && annoyingList[j] && annoyingList[j].user2.name !== messageList[i].sender.name)
				j++;
			if (messageList[i].sender.name !== user.name && annoyingList && annoyingList[j])
				data.push
				({ 
					id: messageList[i].sender.id,
					username: messageList[i].sender.name,
					message: "Blocked message",
				});
			else
				data.push
				({
					id: messageList[i].sender.id,
					username: messageList[i].sender.name,
					message: messageList[i].message
				});
			i++;
		}
		data.reverse();
		return (data);
	}

	async resumeprivate(token: string | undefined, userId: number) : Promise<number | any>
	{
		const receiver = await this.userService.findOneByToken(token);
		if (receiver === null)
			return (-1);
		const sender = await this.userService.findOneById(userId);
		if (sender === null)
			return (-2);
		const messageList = await this.privateService.findOneByPrivate(receiver, sender);
		if (messageList === null)
			return (null);
		let data = [];
		let ret = await this.relationService.getRelationStatus(receiver, sender);
		let i = 0;
		while (messageList[i])
		{
			if (ret === "XV" || ret === "enemy")
				data.push({ id: messageList[i].user1.id, username: messageList[i].user1.name, message: "Blocked message" });
			else
				data.push({ id: messageList[i].user1.id, username: messageList[i].user1.name, message: messageList[i].message });
			i++;
		}
		return (data);
	}

	async getChannelList(token: string | undefined) : Promise<number | String[]>
	{
		const askMan = await this.userService.findOneByToken(token);
		if (askMan === null)
			return (-1);
		let channelList = await this.joinChannelService.getJoinedChannel(askMan);
		let i = 0;
		let data = [];
		while (channelList && channelList[i])
		{
			data.push(channelList[i].channel.name);
			i++;
		}
		return (data);
	}

	async getFriends(token: string | undefined) : Promise<number | any[]>
	{
		const askMan = await this.userService.findOneByToken(token);
		if (askMan === null)
			return (-1);
		let friendList = await this.relationService.getFriendUser(askMan);
		let i = 0;
		let data = [];
		while (friendList && friendList[i])
		{
			let tmp =
			{
				id: friendList[i].user2.id,
				name: friendList[i].user2.name,
			}
			data.push(tmp);
			i++;
		}
		return (data);
	}

	async getFriendRequest(token: string | undefined) : Promise<number | any[]>
	{
		const askMan = await this.userService.findOneByToken(token);
		if (askMan === null)
			return (-1);
		let requestList = await this.relationService.getFriendRequest(askMan);
		let i = 0;
		let data = [];
		while (requestList && requestList[i])
		{
			let tmp =
			{
				id: requestList[i].user1.id,
				name: requestList[i].user1.name,
			}

			data.push(tmp);
			i++;
		}
		return (data);
	}

	async getBlocked(token: string | undefined) : Promise<number | any[]>
	{
		const askMan = await this.userService.findOneByToken(token);
		if (askMan === null)
			return (-1);
		let blockedList = await this.relationService.getAnnoyingUser(askMan);
		let i = 0;
		let data = [];
		while (blockedList && blockedList[i])
		{
			let tmp =
			{
				id: blockedList[i].user2.id,
				name: blockedList[i].user2.name,
			}
			data.push(tmp);
			i++;
		}
		return (data);
	}

	async getChannelInvite(token: string | undefined) : Promise<number | String[]>
	{
		const askMan = await this.userService.findOneByToken(token);
		if (askMan === null)
			return (-1);
		let inviteList = await this.inviteListService.getInvite(askMan);
		let i = 0;
		let data = [];
		while (inviteList && inviteList[i])
		{
			data.push(inviteList[i].channel.name);
			i++;
		}
		return (data);
	}

	async getHistory(token: string | undefined, id: number) : Promise<number | any[]>
	{
		const askMan = await this.userService.findOneByToken(token);
		const toGet = await this.userService.findOneById(id);
		if (askMan === null)
			return (-1);
		if (toGet === null)
			return (-2);
		let matchHistory = await this.gameService.getMatchHistory(toGet);
		let i = 0;
		let data = [];
		while (matchHistory && matchHistory[i])
		{
			let tmp =
			{
				scoreP1 : matchHistory[i].score1,
				scoreP2 : matchHistory[i].score2,
				P1 : matchHistory[i].user1.name,
				P2 : matchHistory[i].user2.name,
			}
			data.push(tmp);
			i++;
		}
		return (data);
	}
}
