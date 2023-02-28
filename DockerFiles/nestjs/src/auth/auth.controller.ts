import { Controller, Get, Redirect, Header, Req, Post, Body, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express'; 

import { AuthDto} from './auth.entity';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

import { sendError, sendSuccess } from '../common/response';

import { errorMessages, urls } from '../common/global'; 

let crypto = require("crypto");
let random = crypto.randomBytes(20).toString('hex');

@Controller("auth")
export class AuthController
{
	constructor(private readonly authService: AuthService)
	{

	}


	@Get('redirect')
	Redirect()
	{
		let CLIENT_ID = process.env.UID
		return (`https://api.intra.42.fr/oauth/authorize?client_id=${CLIENT_ID}
			&redirect_uri=${encodeURIComponent(urls.URI)}&response_type=code&scope=public
			&state=${random}`);
	}

	@Post('register')
	async Register(@Body() tokenForm: AuthDto, @Res() res: Response)
	{
		console.log('Request received');
		console.log("state = " + tokenForm.state);
		console.log("code = " + tokenForm.code);
		if (tokenForm.state === undefined || tokenForm.code === undefined)
		{
			console.log('ERROR 1');
			return (sendError(res, -42, errorMessages.MISSING));
		}
		else if (tokenForm.state !== random)
		{
			console.log('ERROR 2');
			return (sendError(res, -43, errorMessages.DIFFERENT));
		}
		else
		{
			try
			{
				const tokenInfo = await this.authService.getUserToken(tokenForm);
				console.log('User token obtained !');
				await new Promise(r => setTimeout(r, 500));
				const userInfo = await this.authService.createUser(tokenInfo.data.access_token);
				console.log('User successfully added to the database !');
				console.log('Sending token to client !');
				return (sendSuccess(res, 10, tokenInfo.data.access_token));
			}
			catch (error)
			{
				console.log("Erreur 3");
				console.log(error);
				return (sendError(res, -44, errorMessages.INVALIDARG));
			}
		}
	}

	@Post('firstconnect')
	@UseGuards(AuthGuard)
	firstConnect(@Res() res: Response)
	{
		console.log("firstconnect");
	}
}
