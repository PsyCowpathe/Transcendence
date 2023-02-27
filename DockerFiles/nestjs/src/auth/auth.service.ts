import { Injectable } from '@nestjs/common';

import { AuthDto} from './auth.entity';

import { urls } from '../common/global';

const axios = require('axios');

@Injectable()
export class AuthService
{
	getUserToken(token : AuthDto)
	{
		let user =
		{
			grant_type: 'authorization_code',
			client_id: process.env.UID, 
			client_secret: process.env.SECRET,
			code: token.code,
			redirect_uri : urls.URI,
			state: token.first_state,
		}
		console.log(user);

		const response = axios.post(urls.TOKEN, user);
		return (response);
	}
}
