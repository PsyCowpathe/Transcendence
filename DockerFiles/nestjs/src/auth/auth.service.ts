import { Injectable } from '@nestjs/common';

import { AuthDto, TwoFADto } from './auth.entity';

import { urls } from '../common/global';

import { UserService } from '../db/user/user.service';
import { ChannelService } from '../db/chat/channel.service';
import { MessageService } from '../db/chat/message.service';
import { PrivateService } from '../db/chat/private.service';
import { JoinChannelService } from '../db/chat/joinchannel.service';
import { RelationService } from '../db/relation/relation.service';
import { User } from '../db/user/user.entity';

import { Profile } from './auth.entity';

import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
const axios = require('axios');
var randomstring = require("randomstring");

@Injectable()
export class AuthService
{
	constructor(private readonly userService : UserService,
				private readonly channelService : ChannelService,
				private readonly messageService : MessageService,
				private readonly joinChannelService : JoinChannelService,
				private readonly relationService : RelationService,
				private readonly privateService : PrivateService)

	{

	}


	async getUserToken(token : AuthDto)
	{
		console.log("state = ");
		console.log(token.state);
		console.log("code = ");
		console.log(token.code);
		let user =
		{
			grant_type: 'authorization_code',
			client_id: process.env.UID, 
			client_secret: process.env.SECRET,
			code: token.code,
			redirect_uri : urls.URI,
			state: token.state,
		}
		const response = await axios.post(urls.TOKEN, user)
		.catch ((error: any) =>
		{
			console.log("Erreur 5");
			console.log(error);
			return (error);
		});
		if (response.data === undefined)
			return (undefined)
		return (response.data.access_token);
	}

	async createUser(originalToken: string, hashedToken: string) : Promise<Profile>
	{
		let data: Profile;

		const Header =
		{
			headers:
			{
				authorization: `Bearer ${originalToken}`,
			}
		}
		const response = await axios.get(urls.ME, Header)
		.catch((error: any) =>
		{
			console.log("Erreur 4");
			return (error);
		});
		let user = await this.userService.findOneByUid(response.data.id);
		if (user === null)
		{
			let newUser : User = new User(); 
			newUser.token = hashedToken;
			newUser.name = response.data.login;
			newUser.uid = response.data.id;
			newUser.registered = false;
			newUser.TwoFASecret = "";
			newUser.TwoFA = false;
			newUser.Status = "Online";
			newUser.Match = 0;
			newUser.Victory = 0;
			newUser.Defeat = 0;
			this.userService.create(newUser);
			data = this.createProfile(true, newUser);
			console.log('User successfully added to the database !');
		}
		else 
		{
			await this.userService.updateToken(hashedToken, user);
			let updatedUser = await this.userService.findOneByUid(response.data.id);
			data = this.createProfile(true, updatedUser);
			console.log('User already exist, updating token in db !');
		}
		return (data);
	}

	createProfile(secret: boolean, user: any) : Profile
	{
		let data: Profile;
		if (secret === true)
		{
			data =
			{
				name : user.name,
				registered : user.registered,
				newtoken : user.token,
				newFA : user.TwoFAToken,
				TwoFA : user.TwoFA,
				Status : user.Status,
				Match : user.Match,
				Victory : user.Victory,
				Defeat : user.Defeat,
			};
		}
		else
		{
			data =
			{
				name : user.name,
				registered : user.registered,
				newtoken : undefined,
				newFA : undefined,
				TwoFA : user.TwoFA,
				Status : user.Status,
				Match : user.Match,
				Victory : user.Victory,
				Defeat : user.Defeat,
			};
		}
		return (data);
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

	async hashMyToken(originalToken: string) : Promise<string>
	{
		const salt = await bcrypt.genSalt();
		const hashedToken = await bcrypt.hash(originalToken, salt);
		return (hashedToken);
	}

	async isTokenValid(token: string | undefined): Promise<boolean>
	{
		if (token === undefined)
			return (false);
		const user = await this.userService.findOneByToken(token);
		if (user === null)
			return (false);
		return (true);
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
			return (-3);
		}
		if (file.size > 8000000)
			return (-4);
		const user = await this.userService.findOneByToken(token);
		if (user === null)
			return (-2);
		fs.writeFile("avatars/" + user.uid, file.buffer,
			(err) =>
			{
        		if (err)
					return (-2);
      		});
		console.log("avatar changer avec success");
		return (1);
	}


	async generate2FA(token: string | undefined) : Promise<number | string>
	{
		const user = await this.userService.findOneByToken(token);
		if (user === null)
			return (-1);
		if (user.TwoFA === true)
			return (-2);
		const secret = authenticator.generateSecret();
		const url = authenticator.keyuri(user.name, 'Transcendence', secret);
		await this.userService.updateTwoFASecret(secret, user);
		return (url);
	}

	
	async twoFALogin(token: string | undefined, code: TwoFADto) : Promise<number>
	{
		const user = await this.userService.findOneByToken(token);
		if (user === null || token === undefined)
			return (-1);
		const isCodeValid = await authenticator.verify({token: code.code.toString(), secret: user.TwoFASecret});
		if (isCodeValid === false)
			return (-2);
		if (user.TwoFA === false)
			await this.userService.updateTwoFA(true, user);
		let TwoFAToken = randomstring.generate({lenght: 20});
		let expire = (Date.now() + 720000).toString();
		await this.userService.updateTwoFAToken(TwoFAToken, expire, user);
		return (1);
	}

	async resumeChannel(token: string | undefined, channelName: string) : Promise <number | any>
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
		//console.log("meesage =");
		//console.log(messageList);
		const annoyingList = await this.relationService.getAnnoyingUser(user);
		let data = [];
		let i = 0;
		console.log("asker = ");
		console.log(user.name);
		while (messageList[i])
		{
			let	j = 0;
			while (annoyingList && annoyingList[j] && annoyingList[j].user2.name !== messageList[i].sender.name)
				j++;
			if (messageList[i].sender.name !== user.name && annoyingList && annoyingList[j])
				data.push({ username: messageList[i].sender.name, message: "Blocked message" });
			else
				data.push({ username: messageList[i].sender.name, message: messageList[i].message });
			i++;
		}
		data.reverse();
		return (data);
	}

	async resumeprivate(token: string | undefined, username: string) : Promise <number | any>
	{
		const receiver = await this.userService.findOneByToken(token);
		if (receiver === null)
			return (-1);
		const sender = await this.userService.findOneByName(username);
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
				data.push({ username: messageList[i].user1.name, message: "Blocked message" });
			else
				data.push({ username: messageList[i].user1.name, message: messageList[i].message });
			i++;
		}
		return (data);
	}

	async getChannelList(token: string | undefined) : Promise <number | String[]>
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

	async getFriends(token: string | undefined) : Promise <number | String[]>
	{
		const askMan = await this.userService.findOneByToken(token);
		if (askMan === null)
			return (-1);
		let friendList = await this.relationService.getFriendUser(askMan);
		let i = 0;
		let data = [];
		while (friendList && friendList[i])
		{
			data.push(friendList[i].user2.name);
			i++;
		}
		return (data);
	}

	async getFriendRequest(token: string | undefined) : Promise <number | String[]>
	{
		const askMan = await this.userService.findOneByToken(token);
		if (askMan === null)
			return (-1);
		let requestList = await this.relationService.getFriendRequest(askMan);
		let i = 0;
		let data = [];
		while (requestList && requestList[i])
		{
			data.push(requestList[i].user1.name);
			i++;
		}
		return (data);
	}

	async getBlocked(token: string | undefined) : Promise <number | String[]>
	{
		const askMan = await this.userService.findOneByToken(token);
		if (askMan === null)
			return (-1);
		let blockedList = await this.relationService.getAnnoyingUser(askMan);
		let i = 0;
		let data = [];
		while (blockedList && blockedList[i])
		{
			data.push(blockedList[i].user2.name);
			i++;
		}
		return (data);
	}
}
