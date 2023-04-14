import { Injectable } from '@nestjs/common'

import { UserService } from '../../db/user/user.service';

import { GameService } from '../../db/game/game.service'
import { MatchMaking } from '../../db/game/game.entity'

@Injectable()
export class PongService
{
	constructor (private readonly gameService: GameService,
					private readonly userService: UserService)
	{

	}

	async joinQueue(token : string | undefined) : Promise<number>
	{
		let askMan = await this.userService.findOneByToken(token);
		if (askMan === null)
			return (-1);
		if (await this.gameService.isInMM(askMan) === true)
			return (-2);
		let newMM : MatchMaking = new MatchMaking();
		newMM.user = askMan; 
		await this.gameService.createMatchMaking(newMM);
		return (1);
	}

	async joinSpectate(token : string | undefined, gameId: number)
	{

	}
}
