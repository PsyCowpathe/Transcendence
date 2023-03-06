import { Injectable } from '@nestjs/common';

import { AuthDto} from './auth.entity';

import { urls } from '../common/global';

import { UserService } from '../db/user/user.service';
import { User } from '../db/user/user.entity';

import { Profile } from './auth.entity';

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
			data = this.createProfile(false, user, hashedToken);
			console.log('User successfully added to the database !');
		}
		else 
		{
			await this.userService.updateToken(hashedToken, user);
			data = this.createProfile(true, user, hashedToken);
			console.log('User already exist, updating token in db !');
		}
		return (data);
	}


	createProfile(registered: boolean, userInfos: any, hashedToken?: string) : Profile
	{
		let data: Profile;
		console.log("info ");
		console.dir(userInfos, { depth: null })
		data =
		{
			name : userInfos.name,
			registered : registered,
			newtoken : hashedToken,
		};
		return (data);
	}

	async defineName(name: string, token: string | undefined) : Promise<number>
	{
		console.log(token);
		let ret = await this.userService.findOneByName(name);
		if (ret !== null)
			return (-1);
		let user = await this.userService.findOneByToken(token);
		if (user !== null)
		{
			await this.userService.updateName(name, user);
			await this.userService.updateRegister(true, user);
		}
		return (1);
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
