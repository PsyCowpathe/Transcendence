import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MatchHistory, MatchMaking } from './game.entity';
import { User } from '../user/user.entity';

@Injectable()
export class GameService
{
	constructor(@InjectRepository(MatchHistory) private historyRepository: Repository<MatchHistory>,
				@InjectRepository(MatchMaking) private mMRepository: Repository<MatchMaking>)
	{

	}


//=====		MatchHistory		=====


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
                {user2: user},
            ]
        });
        if (ret[0] === undefined)
            return (null);
        return (ret);   
    }


//=====		MatchMaking		=====


    createMatchMaking(newMM : MatchMaking)
	{
		return (this.mMRepository.save(newMM));
	}

	async isInMM(user: User) : Promise<boolean>
	{
		let ret = await this.mMRepository
		.find
		({
			where:
			[
				{user: user},
			]
		});
		if (ret[0] === undefined)
			return (false);
		return (true);

	}

	async getMM(user: User) : Promise <MatchMaking[] | null>
	{
		let ret = await this.mMRepository
		.find
		({
			where:
			[
				{user: !user},
			]
		});
		if (ret[0] === undefined)
			return (null);
		return (ret);
	}

	removeMM(user: User)
	{
		this.mMRepository.createQueryBuilder("match_making")
			.delete()
			.where("user = :user", {user: user})
			.execute();
	}
}
