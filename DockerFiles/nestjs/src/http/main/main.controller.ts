import { Controller, Get, Redirect, Header, Req, Post, Body, Res, UseGuards, UsePipes, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, StreamableFile, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'; 
import { join } from 'path';
import { Response, Request } from 'express'; 

import { MainService } from './main.service';
import { AuthGuard } from '../guard/auth.guard';
import { UserService } from '../../db/user/user.service';
import { AuthService } from '../auth/auth.service';

import { sendError, sendSuccess } from '../../common/response';
import { errorMessages } from '../../common/global'; 

import * as fs from "fs";

let crypto = require("crypto");
let random: string; 

@Controller("main")
export class MainController
{
	constructor(private readonly mainService: MainService,
				private readonly userService: UserService,
			  	private readonly authService: AuthService)
	{

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
		let ret = await this.mainService.changeAvatar(req.headers.authorization, file);
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

	@Get('resumechannel/:channel')
	@UseGuards(AuthGuard)
	async resumeChannel(@Req() req: Request, @Res() res: Response, @Param('channel') channelName: string)
	{
		console.log("resume channel");
		console.log(channelName);
		let ret = await this.mainService.resumeChannel(req.headers.authorization, channelName);
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
		let ret = await this.mainService.resumeprivate(req.headers.authorization, username);
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
		let ret = await this.mainService.getChannelList(req.headers.authorization);
		if (ret === -1)
			return (sendError(res, 401, errorMessages.NOTLOGGED));
		return (sendSuccess(res, 200, ret));
	}

	@Get('getfriends')
	@UseGuards(AuthGuard)
	async getFriends(@Req() req: Request, @Res() res: Response)
	{
		console.log("get friend list");
		let ret = await this.mainService.getFriends(req.headers.authorization);
		if (ret === -1)
			return (sendError(res, 401, errorMessages.NOTLOGGED));
		console.log(ret);
		return (sendSuccess(res, 200, ret));
	}

	@Get('getfriendrequest')
	@UseGuards(AuthGuard)
	async getFriendRequest(@Req() req: Request, @Res() res: Response)
	{
		console.log("get friend request list");
		let ret = await this.mainService.getFriendRequest(req.headers.authorization);
		if (ret === -1)
			return (sendError(res, 401, errorMessages.NOTLOGGED));
		return (sendSuccess(res, 200, ret));
	}

	@Get('getblocked')
	@UseGuards(AuthGuard)
	async getBlocked(@Req() req: Request, @Res() res: Response)
	{
		console.log("get blocked list");
		let ret = await this.mainService.getBlocked(req.headers.authorization);
		if (ret === -1)
			return (sendError(res, 401, errorMessages.NOTLOGGED));
		return (sendSuccess(res, 200, ret));
	}

	@Get('getchannelinvite')
	@UseGuards(AuthGuard)
	async getChannelInvite(@Req() req: Request, @Res() res: Response)
	{
		console.log("get channel invitation");
		let ret = await this.mainService.getChannelInvite(req.headers.authorization);
		if (ret === -1)
			return (sendError(res, 401, errorMessages.NOTLOGGED));
		return (sendSuccess(res, 200, ret));

	}
}
