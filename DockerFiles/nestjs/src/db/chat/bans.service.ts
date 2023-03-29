import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Channel, Bans } from './chat.entity';
import { User } from '../user/user.entity';

@Injectable()
export class BansService
{
	constructor(@InjectRepository(Bans) private bansRepository: Repository<Bans>,)
	{

	}

	findOneById(id: number): Promise<Bans | null>
	{
		return (this.bansRepository.findOneBy({ id }));
	}

	async findOneByBan(user: User, channel: Channel): Promise<Bans[] | null>
	{
		let ret = await this.bansRepository
			.find
			({
				where:
				[
					{channel: channel, user: user}
				]
			});
			if (ret[0] === undefined)
				return (null);
			return (ret);
	}


	create(newBan: Bans)
	{
		return (this.bansRepository.save(newBan));
	}

	async remove(user: User, chanId: Channel)
	{
		let ret = await this.bansRepository.createQueryBuilder()
			.delete()
			.from(Bans)
			.where("channel = :id1 AND user = :id2", {id1: chanId, id2: user.id})
			.execute();
	}
}
