import { Controller, Get } from '@nestjs/common'
import { PongGateway } from './pong.gateway'
import { UserService }  from '../db/user/user.service'
import Ball from './Ball'
import Paddle from './Paddle'
import Player from './Player'
import Game from './Game'

@Controller('pong')
export class PongController
{
	constructor (private readonly userService: UserService)
	{
		const gateway =  new PongGateway(userService);
	}
}
