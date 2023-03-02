import { Controller, Get, Redirect, Header, Req, Post, Body, Res, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express'; 

import { AuthDto, RegisterDto } from './auth.entity';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

import { sendError, sendSuccess } from '../common/response';

import { errorMessages, urls } from '../common/global'; 

let crypto = require("crypto");
let random = crypto.randomBytes(20).toString('hex');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

@Controller("auth")
export class AuthController
{
	constructor(private readonly authService: AuthService)
	{

	}

	@Get('redirect')
	async Redirect(@Req() req: Request)
	{
		let ret = await this.authService.isTokenValid(req.cookies.token);
		/*if (ret === true)
		{
			console.log('Token valide');
			return (`urls.URI`);
		}
		else
		{*/
			console.log('Token invalide');
			let CLIENT_ID = process.env.UID
			return (`https://api.intra.42.fr/oauth/authorize?client_id=${CLIENT_ID}
			&redirect_uri=${encodeURIComponent(urls.URI)}&response_type=code&scope=public
			&state=${random}`);
		//}
	}

	@Post('register')
	async Register(@Body() tokenForm: AuthDto, @Res() res: Response)
	{
		console.log('Register received');
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
			//const tokenInfo = await this.authService.getUserToken(tokenForm);
			try
			{
				const tokenInfo = await this.authService.getUserToken(tokenForm);
				console.log('User token obtained !');
				await new Promise(r => setTimeout(r, 500));
				const hashedToken = await this.authService.hashMyToken(tokenInfo.data.access_token);
				const userInfo = await this.authService.createUser(tokenInfo.data.access_token, hashedToken);
				console.log('User successfully added to the database !');
				console.log('Sending token to client !');
				return(res.status(200).cookie('token', hashedToken, { sameSite : 'none', secure : true}).json(tokenInfo.data.access_token));
				//return (sendSuccess(res, 10, tokenInfo.data.access_token));
			}
			catch (error)
			{
				console.log("Erreur 3");
				//console.log(error);
				return (sendError(res, -44, errorMessages.INVALIDARG));
			}
		}
	}

	//@UseGuards(AuthGuard)
	@Post('firstconnect')
	async firstConnect(@Body() registerForm: RegisterDto, @Res() res: Response)
	{
		console.log("firstconnect = " + registerForm.name);
		if (registerForm.name === undefined)
		{
			console.log('ERROR 11');
			return (sendError(res, -44, errorMessages.NONAME));
		}
		let ret = await this.authService.defineName(registerForm.name);
		if (ret === false)
			return (sendError(res, -45, errorMessages.ALREADYTAKEN));
		let user = await this.authService.getUserInfos(registerForm.name);
		return (sendSuccess(res, 11, user));
	}
}
