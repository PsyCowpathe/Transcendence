import { Injectable } from '@nestjs/common';

import { AuthDto, TwoFADto } from './auth.entity';

import { urls } from '../../common/global';

import { UserService } from '../../db/user/user.service';
import { User } from '../../db/user/user.entity';

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
	constructor(private readonly userService : UserService)

	{

	}

	async getUserToken(token : AuthDto) : Promise<string | undefined>
	{
		let user =
		{
			grant_type: 'authorization_code',
			client_id: process.env.UID, 
			client_secret: process.env.SECRET,
			code: token.code,
			redirect_uri : process.env.URI,
			state: token.state,
		}
		const response = await axios.post(urls.TOKEN, user)
		.catch ((error: any) =>
		{
			return (undefined)
		});
		if (response === undefined)
			return (undefined)
		return (response.data.access_token);
	}

	async createUser(originalToken: string, hashedToken: string) : Promise<Profile | number>
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
			return (undefined);
		});
		if (response === undefined)
			return (-1);
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
			data = await this.createProfile(true, newUser);
		}
		else 
		{
			await this.userService.updateToken(hashedToken, user);
			let updatedUser = await this.userService.findOneByUid(response.data.id);
			data = await this.createProfile(true, updatedUser);
		}
		return (data);
	}

	createProfile(secret: boolean, user: User | null) : Profile
	{
		let data: any;
		if (user === null)
			return (data);
		if (secret === true)
		{
			data =
			{
				id : user.id,
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
				id : user.id,
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

	async hashMyToken(originalToken: string) : Promise<string | undefined>
	{
		try
		{
			const salt = await bcrypt.genSalt();
			const hashedToken = await bcrypt.hash(originalToken, salt);
			return (hashedToken);
		}
		catch (err)
		{
			return (undefined);
		}
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
		let expire = (Date.now() + 7200000).toString();
		await this.userService.updateTwoFAToken(TwoFAToken, expire, user);
		return (1);
	}
}
