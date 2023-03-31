import { Controller, Get } from '@nestjs/common'
import { Ball } from './Ball.ts'
import { Paddle } from './Paddle.ts'

@Controller('pong')
export class PongController
{
	@Get('pong')
	index() {}
	findAll(): any
	{
		return ('smth');
	}
}
