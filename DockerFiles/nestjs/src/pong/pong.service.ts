import { Injectable } from '@nestjs/common'
import { Cat } from './interfaces/cat.interface'

@Injectable()
export class PongService
{
	private readonly pong: Pong[] = [];

	create(pong: Pong)
	{
		this.pong.push(pong);
	}

	findAll(): Pong
	{
		return (this.pong);
	}
}
