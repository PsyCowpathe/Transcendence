import { Injectable } from '@nestjs/common';

import { AuthDto} from './auth.entity';

import { urls } from '../common/global';

import { UserService} from '../db/user/user.service';

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

	createUser(token : string)
	{
		const Header =
		{
			headers:
			{
				authorization: `Bearer ${token}`,
			}
		}
		const response = axios.get(urls.ME, Header);
		response.then((json: any) =>
		{
			const newUser =
			{
				id : json.data.id,
				token : token,
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
}
