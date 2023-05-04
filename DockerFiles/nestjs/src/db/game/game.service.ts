import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MatchHistory } from './game.entity';
import { User } from '../user/user.entity';

@Injectable()
export class GameService
{
	constructor(@InjectRepository(MatchHistory) private historyRepository: Repository<MatchHistory>)
	{

	}

    createMatchHistory(newGame : MatchHistory)
	{
		return (this.historyRepository.save(newGame));
	}

    async getMatchHistory(user : User) : Promise<MatchHistory[] | null>
    {
		let ret = await this.historyRepository
			.find
			({
				where:
				[
					{user1: user},
					{user2: user}
				]
			});
        if (ret === null)
			return (null);
        return (ret);   
    }
}
