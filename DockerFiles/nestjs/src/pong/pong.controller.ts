import { Controller, Get } from '@nestjs/common'
import { Ball } from './Ball.ts'
import { Paddle } from './Paddle.ts'

@Controller('pong')
export class PongController
{
//	@Get('pong')
	constructor(private pongGateway: PongGateway) {}

	@Post('/addPlayer')
	addPlayer(@Body('name') name: string) {
		this.pongGateway.addPlayer(name);
  	}
}
