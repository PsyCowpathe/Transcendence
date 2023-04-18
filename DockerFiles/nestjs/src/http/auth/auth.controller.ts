import { Controller, Get, Redirect, Header, Req, Post, Body, Res, UseGuards, UsePipes, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, StreamableFile, Param, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'; 
import { createReadStream } from 'fs';
import { join } from 'path';
import { Response, Request } from 'express'; 
import { AuthDto, ChangeLoginDto, TwoFADto } from './auth.entity';
import { AuthService } from './auth.service';
import { AuthGuard } from '../guard/auth.guard';
import { UserService } from '../../db/user/user.service';


import { sendError, sendSuccess } from '../../common/response';

import { errorMessages, urls } from '../../common/global'; 
import * as fs from "fs";

let crypto = require("crypto");
let random: string; 

@Controller("auth")
export class AuthController
{
	constructor(private readonly authService: AuthService,
				private readonly userService: UserService)
	{

	}

	@Get('redirect')
	async Redirect(@Req() req: Request)
	{
		console.log("Redirection");
		let ret = await this.authService.isTokenValid(req.headers.authorization);
		if (ret === true)
		{
			console.log('Token valide');
			return (`/affUser`);
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
	@UsePipes(new ValidationPipe())
	async Register(@Body() tokenForm: AuthDto, @Res() res: Response)
	{
		console.log('Register received');
		if (tokenForm.state === undefined || tokenForm.code === undefined)
		{
			console.log('ERROR 1');
			return (sendError(res, 400, errorMessages.MISSING));
		}
		else if (tokenForm.state !== random)
		{
			console.log('ERROR 2');
			return (sendError(res, 400, errorMessages.DIFFERENT));
		}
		else
		{
			const apiToken = await this.authService.getUserToken(tokenForm);
			if (apiToken === undefined)
				return (sendError(res, 400, errorMessages.INVALIDCODE));
			console.log('User token obtained !');
			await new Promise(r => setTimeout(r, 500));
			const hashedToken = await this.authService.hashMyToken(apiToken);
			if (hashedToken === undefined)
				return (sendError(res, 500, errorMessages.HASHFAIL));
			const data = await this.authService.createUser(apiToken, hashedToken);
			if (data === -1)
				return (sendError(res, 500, errorMessages.APIFAIL));
			if (data === null)
				return (sendError(res, 500, errorMessages.CREATEFAIL));
			console.log('Sending token to client !');
			return (sendSuccess(res, 201, data));
		}
	}

	@Post('loginchange')
	@UsePipes(new ValidationPipe())
	@UseGuards(AuthGuard)
	async firstConnect(@Body() registerForm: ChangeLoginDto, @Res() res: Response, @Req() req: Request)
	{
		console.log("changement de login = " + registerForm.name);
		let ret = await this.authService.defineName(registerForm.name, req.headers.authorization);
		if (ret === -1)
			return (sendError(res, 400, errorMessages.ALREADYTAKEN));
		let user = await this.userService.findOneByName(registerForm.name);
		let data = await this.authService.createProfile(true, user);
		return (sendSuccess(res, 201, data));
	}
	
	@Get('set2FA')
	@UseGuards(AuthGuard)
	async set2FA(@Req() req: Request, @Res() res: Response)
	{
		console.log("Try to activate 2FA")
		let ret = await this.authService.generate2FA(req.headers.authorization);
		if (ret === -1)
			return (sendError(res, 401, errorMessages.NOTLOGGED));
		if (ret === -2)
			return (sendError(res, 400, errorMessages.ALREADYACTIVATE));
		return (sendSuccess(res, 200, ret));
	}

	@Post('2FAlogin')
	@UsePipes(new ValidationPipe())
	@UseGuards(AuthGuard)
	async TwoFALogin(@Req() req: Request, @Res() res: Response, @Body() TwoFAForm: TwoFADto)
	{
		console.log("login with 2fa");
		console.log(TwoFAForm);
		let ret = await this.authService.twoFALogin(req.headers.authorization, TwoFAForm);
		if (ret === -1)
			return (sendError(res, 401, errorMessages.NOTLOGGED));
		if (ret === -2)
			return (sendError(res, 400, errorMessages.INVALIDCODE));
		let user = await this.userService.findOneByToken(req.headers.authorization);
		let data = await this.authService.createProfile(true, user);
		return (sendSuccess(res, 201, data));
	}
}
