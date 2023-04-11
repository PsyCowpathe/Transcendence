import { Controller, Get, Redirect, Header, Req, Post, Body, Res, UseGuards, UsePipes, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, StreamableFile, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'; 
import { createReadStream } from 'fs';
import { join } from 'path';
import { Response, Request } from 'express'; 
import { AuthDto, ChangeLoginDto, TwoFADto } from './auth.entity';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { UserService } from '../db/user/user.service';


import { sendError, sendSuccess } from '../common/response';

import { errorMessages, urls } from '../common/global'; 
import * as fs from "fs";

let crypto = require("crypto");
let random: string; 

@Controller("auth")
export class AuthController
{
	constructor(private readonly authService: AuthService, private readonly userService: UserService)
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

	@Post('avatar')
	@UseGuards(AuthGuard)
	@UseInterceptors(FileInterceptor('file'))
	async setAvatar(@UploadedFile() file: Express.Multer.File, @Req() req: Request, @Res() res: Response)
	{
		console.log("changement d'avatar");
		console.log(file);
		if (file === undefined)
			return (sendError(res, 400, errorMessages.INVALIDIMAGE));
		let ret = await this.authService.changeAvatar(req.headers.authorization, file);
		if (ret === -1)
			return (sendError(res, 400, errorMessages.INVALIDIMAGE));
		if (ret === -2)
			return (sendError(res, 500, errorMessages.CANTSAVE));
		if (ret === -3)
			return (sendError(res, 500, errorMessages.DBFAIL));
		return (sendSuccess(res, 200, "You successfully changed your avatar !"));
	}

	@Get('getuserinfos/:name')
	@UseGuards(AuthGuard)
	async getUserInfos(@Req() req: Request, @Res() res: Response, @Param('name') name: string)
	{
		console.log("demande info for user : " + name);
		let toFind = await this.userService.findOneByName(name);
		if (toFind === null)
			return (sendError(res, 400, errorMessages.INVALIDNAME));
		let data = await this.authService.createProfile(true, toFind);
		return (sendSuccess(res, 200, data));
	}

	@Get('avatar')
	@UseGuards(AuthGuard)
	async getAvatar(@Req() req: Request, @Res() res: Response)
	{
		console.log("demande d'avatar");
		const user = await this.userService.findOneByToken(req.headers.authorization);
		if (user === null)
			return (sendError(res, 401, errorMessages.NOTLOGGED));
		if (user === null || !fs.existsSync("/root/backend/avatars/" + user.uid))
			return (res.status(200).sendFile("/root/backend/avatars/default.png"));
		console.log("avatar send");
		return (res.status(200).sendFile("/root/backend/avatars/" + user.uid));
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

	@Get('resumechannel/:channel')
	@UseGuards(AuthGuard)
	async resumeChannel(@Req() req: Request, @Res() res: Response, @Param('channel') channelName: string)
	{
		console.log("resume channel");
		console.log(channelName);
		let ret = await this.authService.resumeChannel(req.headers.authorization, channelName);
		if (ret === -1)
			return (sendError(res, 401, errorMessages.NOTLOGGED));
		if (ret === -2)
			return (sendError(res, 400, errorMessages.CHANNELDONTEXIST));
		if (ret === -3)
			return (sendError(res, 401, errorMessages.NOTJOINED));
		return (sendSuccess(res, 200, ret));
	}

	@Get('resumeprivate/:user')
	@UseGuards(AuthGuard)
	async resumePrivate(@Req() req: Request, @Res() res: Response, @Param('user') username: string)
	{
		console.log("resume private message with ");
		console.log(username);
		let ret = await this.authService.resumeprivate(req.headers.authorization, username);
		if (ret === -1)
			return (sendError(res, 401, errorMessages.NOTLOGGED));
		if (ret === -2)
			return (sendError(res, 400, errorMessages.INVALIDNAME));
		return (sendSuccess(res, 200, ret));
	}

	@Get('channellist')
	@UseGuards(AuthGuard)
	async getChannelList(@Req() req: Request, @Res() res: Response)
	{
		console.log("get channel list");
		let ret = await this.authService.getChannelList(req.headers.authorization);
		if (ret === -1)
			return (sendError(res, 401, errorMessages.NOTLOGGED));
		return (sendSuccess(res, 200, ret));
	}

	@Get('getfriends')
	@UseGuards(AuthGuard)
	async getFriends(@Req() req: Request, @Res() res: Response)
	{
		console.log("get friend list");
		let ret = await this.authService.getFriends(req.headers.authorization);
		if (ret === -1)
			return (sendError(res, 401, errorMessages.NOTLOGGED));
		return (sendSuccess(res, 200, ret));
	}

	@Get('getfriendrequest')
	@UseGuards(AuthGuard)
	async getFriendRequest(@Req() req: Request, @Res() res: Response)
	{
		console.log("get friend request list");
		let ret = await this.authService.getFriendRequest(req.headers.authorization);
		if (ret === -1)
			return (sendError(res, 401, errorMessages.NOTLOGGED));
		return (sendSuccess(res, 200, ret));
	}

	@Get('getblocked')
	@UseGuards(AuthGuard)
	async getBlocked(@Req() req: Request, @Res() res: Response)
	{
		console.log("get blocked list");
		let ret = await this.authService.getBlocked(req.headers.authorization);
		if (ret === -1)
			return (sendError(res, 401, errorMessages.NOTLOGGED));
		return (sendSuccess(res, 200, ret));
	}
}
