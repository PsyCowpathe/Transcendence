import { Controller, Get, Redirect, Header, Req, Post, Body, Res, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express'; 

import { AuthDto, RegisterDto, TokenDto } from './auth.entity';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

import { sendError, sendSuccess } from '../common/response';

import { errorMessages, urls } from '../common/global'; 

let crypto = require("crypto");
let random: string; 

@Controller("auth")
export class AuthController
{
	constructor(private readonly authService: AuthService)
	{

	}

	@Get('redirect')
	async Redirect(@Req() req: Request)
	{
		console.log("redir req = " + req.headers.authorization);
		let ret = await this.authService.isTokenValid(req.headers.authorization);
		if (ret === true)
		{
			console.log('Token valide');
			return (`/`);
		}
		else
		{
			console.log('Token invalide');
			let CLIENT_ID = process.env.UID
			random = crypto.randomBytes(20).toString('hex');
			return (`https://api.intra.42.fr/oauth/authorize?client_id=${CLIENT_ID}
			&redirect_uri=${encodeURIComponent(urls.URI)}&response_type=code&scope=public
			&state=${random}`);
		}
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
			try
			{
				const apiToken = await this.authService.getUserToken(tokenForm);
				if (apiToken === undefined)
					return (sendError(res, -45, errorMessages.CODEINVALID));
				console.log('User token obtained !');
				await new Promise(r => setTimeout(r, 500));
				const hashedToken = await this.authService.hashMyToken(apiToken);
				const data = await this.authService.createUser(apiToken, hashedToken);
				console.log('Sending token to client !');
				console.log(hashedToken);
				return (sendSuccess(res, 10, data));
			}
			catch (error)
			{
				console.log("Erreur 3");
				console.log(error);
				return (sendError(res, -44, errorMessages.INVALIDARG));
			}
		}
	}

	@Post('loginchange')
	@UseGuards(AuthGuard)
	async firstConnect(@Body() registerForm: RegisterDto, @Res() res: Response, @Req() req: Request)
	{
		console.log("changement de login = " + registerForm.name);
		if (registerForm.name === undefined)
		{
			console.log('ERROR 11');
			return (sendError(res, -44, errorMessages.NONAME));
		}
		console.log(req.headers.authorization);
		let ret = await this.authService.defineName(registerForm.name, req.headers.authorization);
		if (ret === -1)
			return (sendError(res, -45, errorMessages.ALREADYTAKEN));
		let user = await this.authService.getUserInfos(registerForm.name);
		let data = this.authService.createProfile(true, user);
		return (sendSuccess(res, 11, data));
	}
}
