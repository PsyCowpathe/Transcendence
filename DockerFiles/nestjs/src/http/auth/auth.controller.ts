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

//Les erreurs 418 devraient etre des erreurs 500 mais le sujet l'interdit

@Controller("auth")
export class AuthController
{
	constructor(private readonly authService: AuthService,
				private readonly userService: UserService)
	{

	}

	@Get('redirect')
	async Redirect(@Req() req: Request, @Res() res: Response)
	{
		let ret = await this.authService.isTokenValid(req.headers.authorization);
		if (ret === true)
			return (sendSuccess(res, 201, "/affUser"));
		else
		{
			let URI = process.env.URI;
			if (URI === undefined)
				return (sendError(res, 418, errorMessages.MISSINGURI));
			let CLIENT_ID = process.env.UID;
			random = crypto.randomBytes(20).toString('hex');
			let link = `https://api.intra.42.fr/oauth/authorize?client_id=${CLIENT_ID}
			&redirect_uri=${encodeURIComponent(URI)}&response_type=code&scope=public
			&state=${random};`
			return (sendSuccess(res, 201, link));
		}
	}

	@Post('register')
	@UsePipes(new ValidationPipe())
	async Register(@Body() tokenForm: AuthDto, @Res() res: Response)
	{
		if (tokenForm.state === undefined || tokenForm.code === undefined)
			return (sendError(res, 400, errorMessages.MISSING));
		else if (tokenForm.state !== random)
			return (sendError(res, 400, errorMessages.DIFFERENT));
		else
		{
			const apiToken = await this.authService.getUserToken(tokenForm);
			if (apiToken === undefined)
				return (sendError(res, 400, errorMessages.INVALIDCODE));
			await new Promise(r => setTimeout(r, 418));
			const hashedToken = await this.authService.hashMyToken(apiToken);
			if (hashedToken === undefined)
				return (sendError(res, 418, errorMessages.HASHFAIL));
			const data = await this.authService.createUser(apiToken, hashedToken);
			if (data === -1)
				return (sendError(res, 418, errorMessages.APIFAIL));
			if (data === null)
				return (sendError(res, 418, errorMessages.CREATEFAIL));
			return (sendSuccess(res, 201, data));
		}
	}

	@Post('loginchange')
	@UsePipes(new ValidationPipe())
	@UseGuards(AuthGuard)
	async firstConnect(@Body() registerForm: ChangeLoginDto, @Res() res: Response, @Req() req: Request)
	{
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
		let ret = await this.authService.generate2FA(req.headers.authorization);
		if (ret === -1)
			return (sendError(res, 401, errorMessages.INVALIDUSER));
		if (ret === -2)
			return (sendError(res, 400, errorMessages.ALREADYACTIVATE));
		return (sendSuccess(res, 200, ret));
	}

	@Post('2FAlogin')
	@UsePipes(new ValidationPipe())
	@UseGuards(AuthGuard)
	async TwoFALogin(@Req() req: Request, @Res() res: Response, @Body() TwoFAForm: TwoFADto)
	{
		let ret = await this.authService.twoFALogin(req.headers.authorization, TwoFAForm);
		if (ret === -1)
			return (sendError(res, 401, errorMessages.INVALIDUSER));
		if (ret === -2)
			return (sendError(res, 400, errorMessages.INVALIDCODE));
		let user = await this.userService.findOneByToken(req.headers.authorization);
		let data = await this.authService.createProfile(true, user);
		return (sendSuccess(res, 201, data));
	}
}
