import { Controller, Get, Post, Body } from '@nestjs/common'
import { PongGateway } from './pong.gateway'
import { UserService }  from '../db/user/user.service'
import Ball from './Ball'
import Paddle from './Paddle'
import Player from './Player'
import Game from './Game'

@Controller('pong')
export class PongController
{
	gateway: PongGateway;

	constructor (private readonly userService: UserService)
	{
		this.gateway =  new PongGateway(userService);
	}

	@Get('getGames')
	getGames()
	{
		return (this.gateway.getGames());
	}

	@Post('joinQueue')
	async joinQueue(@Body() body: any)
	{
		this.gateway.joinQueue(parseInt(body.uid));
	}

	@Post('spectateGame')
	async joinSpectate(@Body() body: any)
	{
		this.gateway.joinSpectators(parseInt(body.uid), parseInt(body.gameToSpec));
	}
}
