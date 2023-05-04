import { Controller, Get, Redirect, Header, Req, Post, Body, Res, UseGuards, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, StreamableFile, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'; 
import { join } from 'path';
import { Response, Request } from 'express'; 

import { MainService } from './main.service';
import { stringParameterDto, numberParameterDto } from './main.entity';
import { AuthGuard } from '../guard/auth.guard';
import { UserService } from '../../db/user/user.service';
import { AuthService } from '../auth/auth.service';

import { sendError, sendSuccess } from '../../common/response';
import { errorMessages } from '../../common/global'; 

import * as fs from "fs";

let crypto = require("crypto");
let random: string; 

//Les erreurs 418 devraient etre des erreurs 500 mais le sujet l'interdit

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
		if (file === undefined)
			return (sendError(res, 400, errorMessages.INVALIDIMAGE));
		let ret = await this.mainService.changeAvatar(req.headers.authorization, file);
		if (ret === -1)
			return (sendError(res, 400, errorMessages.INVALIDIMAGE));
		if (ret === -2)
			return (sendError(res, 400, errorMessages.INVALIDUSER));
		if (ret === -3)
			return (sendError(res, 418, errorMessages.CANTSAVE));
		return (sendSuccess(res, 200, "You successfully changed your avatar !"));
	}

	@Get('getuserinfos')
	@UseGuards(AuthGuard)
	@UsePipes(new ValidationPipe())
	async getUserInfos(@Req() req: Request, @Res() res: Response, @Query('user') userId: numberParameterDto)
	{
		let toFind = await this.userService.findOneById(userId.id);
		if (toFind === null)
			return (sendError(res, 400, errorMessages.INVALIDNAME));
		let data = await this.authService.createProfile(true, toFind);
		return (sendSuccess(res, 200, data));
	}

	@Get('avatar')
	@UseGuards(AuthGuard)
	@UsePipes(new ValidationPipe())
	async getAvatar(@Req() req: Request, @Res() res: Response, @Query('user') userId: numberParameterDto)
	{
		const user = await this.userService.findOneById(userId.id);
		if (user === null)
			return (sendError(res, 400, errorMessages.INVALIDNAME));
		if (!fs.existsSync("/root/backend/avatars/" + user.uid))
			return (res.status(200).sendFile("/root/backend/avatars/default.png"));
		return (res.status(200).sendFile("/root/backend/avatars/" + user.uid));
	}

	@Get('resumechannel')
	@UseGuards(AuthGuard)
	@UsePipes(new ValidationPipe())
	async resumeChannel(@Req() req: Request, @Res() res: Response, @Query('channel') channel: stringParameterDto)
	{
		let ret = await this.mainService.resumeChannel(req.headers.authorization, channel.channelName);
		if (ret === -1)
			return (sendError(res, 401, errorMessages.INVALIDUSER));
		if (ret === -2)
			return (sendError(res, 400, errorMessages.CHANNELDONTEXIST));
		if (ret === -3)
			return (sendError(res, 401, errorMessages.NOTJOINED));
		return (sendSuccess(res, 200, ret));
	}

	@Get('resumeprivate')
	@UseGuards(AuthGuard)
	@UsePipes(new ValidationPipe())
	async resumePrivate(@Req() req: Request, @Res() res: Response, @Query('user') userId: numberParameterDto)
	{
		let ret = await this.mainService.resumeprivate(req.headers.authorization, userId.id);
		if (ret === -1)
			return (sendError(res, 401, errorMessages.INVALIDUSER));
		if (ret === -2)
			return (sendError(res, 400, errorMessages.INVALIDNAME));
		return (sendSuccess(res, 200, ret));
	}

	@Get('channellist')
	@UseGuards(AuthGuard)
	async getChannelList(@Req() req: Request, @Res() res: Response)
	{
		let ret = await this.mainService.getChannelList(req.headers.authorization);
		if (ret === -1)
			return (sendError(res, 401, errorMessages.INVALIDUSER));
		return (sendSuccess(res, 200, ret));
	}

	@Get('getfriends')
	@UseGuards(AuthGuard)
	async getFriends(@Req() req: Request, @Res() res: Response)
	{
		let ret = await this.mainService.getFriends(req.headers.authorization);
		if (ret === -1)
			return (sendError(res, 401, errorMessages.INVALIDUSER));
		return (sendSuccess(res, 200, ret));
	}

	@Get('getfriendrequest')
	@UseGuards(AuthGuard)
	async getFriendRequest(@Req() req: Request, @Res() res: Response)
	{
		let ret = await this.mainService.getFriendRequest(req.headers.authorization);
		if (ret === -1)
			return (sendError(res, 401, errorMessages.INVALIDUSER));
		return (sendSuccess(res, 200, ret));
	}

	@Get('getblocked')
	@UseGuards(AuthGuard)
	async getBlocked(@Req() req: Request, @Res() res: Response)
	{
		let ret = await this.mainService.getBlocked(req.headers.authorization);
		if (ret === -1)
			return (sendError(res, 401, errorMessages.INVALIDUSER));
		return (sendSuccess(res, 200, ret));
	}

	@Get('getchannelinvite')
	@UseGuards(AuthGuard)
	async getChannelInvite(@Req() req: Request, @Res() res: Response)
	{
		let ret = await this.mainService.getChannelInvite(req.headers.authorization);
		if (ret === -1)
			return (sendError(res, 401, errorMessages.INVALIDUSER));
		return (sendSuccess(res, 200, ret));

	}

	@Get('matchresume')
	@UseGuards(AuthGuard)
	async getHistory(@Req() req: Request, @Res() res: Response, @Query('user') userId: numberParameterDto)
	{
		let ret = await this.mainService.getHistory(req.headers.authorization, userId.id);
		if (ret === -1)
			return (sendError(res, 401, errorMessages.INVALIDUSER));
		if (ret === -2)
			return (sendError(res, 400, errorMessages.MISSINGUSER));
		return (sendSuccess(res, 200, ret));
	}
}
