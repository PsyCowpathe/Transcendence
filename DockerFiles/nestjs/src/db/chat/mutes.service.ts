import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Channel, Mutes } from './chat.entity';
import { User } from '../user/user.entity';

@Injectable()
export class MutesService
{
	constructor(@InjectRepository(Mutes) private mutesRepository: Repository<Mutes>,)
	{

	}

	findOneById(id: number): Promise<Mutes | null>
	{
		return (this.mutesRepository.findOneBy({ id }));
	}

	async findOneByMute(user: User, channel: Channel): Promise<Mutes[] | null>
	{
		let ret = await this.mutesRepository
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
	
	updateMuteEnd(user: User, channel: Channel, end: string)
	{
		return this.mutesRepository.createQueryBuilder()
		.update("mutes")
		.where("channel = :channel AND user = :user", {channel: channel.id, user: user.id})
		.set({end: end})
		.execute();
	}

	create(newMute: Mutes)
	{
		return (this.mutesRepository.save(newMute));
	}
}
