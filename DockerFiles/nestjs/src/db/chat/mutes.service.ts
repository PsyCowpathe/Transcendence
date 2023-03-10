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

	create(newMute: Mutes)
	{
		return (this.mutesRepository.save(newMute));
	}

	async remove(user: User, chanId: Channel)
	{
		let ret = await this.mutesRepository.createQueryBuilder()
			.delete()
			.from(Mutes)
			.where("channel = :id1 AND user = :id2", {id1: chanId, id2: user.id})
			.execute();
	}
}
