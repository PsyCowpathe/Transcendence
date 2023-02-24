import { Injectable } from '@nestjs/common';

import { AuthDto} from './auth.entity';

const axios = require('axios');

@Injectable()
export class AuthService
{
	getUserToken(token : AuthDto)
	{
		let user =
		{
			grant_type: "authorization_code",
			client_id: process.env.UID, 
			client_secret: process.env.SECRET,
			code: token.code,
			state: token.first_state,
		}

		const url = "https://api.intra.42.fr/oauth/token";
		const response = axios.post(url, user)
		.catch ((error : any) =>
		{
			console.log(error.message);
		});
		console.log(response);
		return (response);
	}
}
