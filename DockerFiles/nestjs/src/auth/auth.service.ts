import { Injectable } from '@nestjs/common';

import { AuthDto} from './auth.entity';

import { urls } from '../common/global';

import { UserService} from '../db/user/user.service';

import * as bcrypt from 'bcrypt';

const axios = require('axios');

@Injectable()
export class AuthService
{
	constructor(private readonly userService : UserService)
	{

	}

	getUserToken(token : AuthDto)
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
		const response = axios.post(urls.TOKEN, user)
		.catch ((error: any) =>
		{
			console.log("Erreur 5");
			console.log(error);
		});
		return (response);
	}

	createUser(originalToken: string, hashedToken: string)
	{
		const Header =
		{
			headers:
			{
				authorization: `Bearer ${originalToken}`,
			}
		}
		const response = axios.get(urls.ME, Header);
		response.then((json: any) =>
		{
			const newUser =
			{
				id : json.data.id,
				token : hashedToken,
				name : json.data.login,
				uid : json.data.id,
			}
			this.userService.create(newUser);
		})
		.catch((error: any) =>
		{
			console.log("Erreur 4");
			console.log(error);
			return (error);
		});
		return (response);
	}

	async hashMyToken(originalToken: string) : Promise<string>
	{
		const salt = await bcrypt.genSalt();
		const hashedToken = await bcrypt.hash(originalToken, salt);
		return (hashedToken);
	}
}
