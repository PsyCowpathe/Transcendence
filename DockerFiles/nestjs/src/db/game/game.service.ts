import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Game } from './game.entity';
import { User } from '../user/user.entity';

@Injectable()
export class GameService
{
	constructor(@InjectRepository(Game) private gameRepository: Repository<Game>,)
	{

	}

    create(newGame : Game)
	{
		return (this.gameRepository.save(newGame));
	}

    async getMatchHistory(user : User) : Promise<Game[] | null>
    {
        let ret = await this.gameRepository
        .find
        ({
            where:
            [
                {user1: user},
                {user2: user},
            ]
        });
        if (ret[0] === undefined)
            return (null);
        return (ret);   
    }
}