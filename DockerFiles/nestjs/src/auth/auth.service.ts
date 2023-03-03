import { Injectable } from '@nestjs/common';

import { AuthDto} from './auth.entity';

import { urls } from '../common/global';

import { UserService } from '../db/user/user.service';
import { User } from '../db/user/user.entity';

import * as bcrypt from 'bcrypt';

const axios = require('axios');

@Injectable()
export class AuthService
{
	constructor(private readonly userService : UserService)
	{

	}

	async getUserToken(token : AuthDto)
	{
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
			//console.log(error);
			return (error);
		});
		if (response.data === undefined)
			return (undefined)
		return (response.data.access_token);
	}

	async createUser(originalToken: string, hashedToken: string)
	{
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
		const user = await this.getUserInfos(undefined, response.data.id);
		if (user === null)
		{
			const newUser =
			{
				id : response.data.id,
				token : hashedToken,
				name : response.data.login,
				uid : response.data.id,
				registered: false,
			}
			this.userService.create(newUser);
			console.log('User successfully added to the database !');
		}
		else
		{
			await this.userService.updateToken(hashedToken, user);
			console.log('User already exist, updating token in db !');
		}
		return (response);
	}


	async defineName(name: string, token: string | undefined) : Promise<boolean>
	{
		console.log(token);
		let ret = await this.userService.findOneByName(name);
		if (ret !== null)
			return (false);
		let user = await this.userService.findOneByToken(token);
		if (user !== null)
		{
			await this.userService.updateName(name, user);
			await this.userService.updateRegister(true, user);
		}
		return (true);
	}

	async getUserInfos(name?: string, uid?: number) : Promise<User | null>
	{
		if (name !== undefined)
			return (this.userService.findOneByName(name));
		else if (uid !== undefined)
			return (this.userService.findOneByUid(uid));
		return (null);
	}

	async hashMyToken(originalToken: string) : Promise<string>
	{
		const salt = await bcrypt.genSalt();
		const hashedToken = await bcrypt.hash(originalToken, salt);
		return (hashedToken);
	}

	async isTokenValid(token: string | undefined): Promise<boolean>
	{
		console.log("token = " + token);
		if (token === undefined)
			return (false);
		const user = await this.userService.findOneByToken(token);
		if (user === null)
			return (false);
		return (true);
	}
}
