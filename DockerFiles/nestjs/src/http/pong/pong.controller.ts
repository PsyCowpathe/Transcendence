import { Controller, Post, Get, Req, Res, Query, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common'

import { Response, Request } from 'express';

import { errorMessages } from '../../common/global'
import { sendError, sendSuccess } from '../../common/response'

import { AuthGuard } from '../guard/auth.guard';

import { PongService } from './pong.service';
import { gameIdDto } from './pong.entity';

@Controller('pong')
export class PongController
{
	constructor (private readonly pongService: PongService)
	{

	}

	@Post('joinQueue')
	@UsePipes(new ValidationPipe())
	@UseGuards(AuthGuard)
	async joinQueue(@Req() req: Request, @Res() res: Response)
	{
		let ret = await this.pongService.joinQueue(req.headers.authorization);
		if (ret === -1)
			return (sendError(res, 401, errorMessages.INVALIDUSER));
		if (ret === -2)
			return (sendError(res, 401, errorMessages.ALREADYMM));
		if (ret === -3)
			return (sendError(res, 401, errorMessages.INGAME));
		return (sendSuccess(res, 201, "You succesfully join the queue !"));
	}

	@Get('spectateGame')
	@UseGuards(AuthGuard)
	@UsePipes(new ValidationPipe())
	async joinSpectate(@Req() req: Request, @Res() res: Response, @Query("game") gameId: gameIdDto)
	{
		this.pongService.joinSpectate(req.headers.authorization, gameId.id);
	}
}
