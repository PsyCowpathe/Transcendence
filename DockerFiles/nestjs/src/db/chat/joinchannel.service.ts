import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Channel, JoinChannel } from './chat.entity';
import { User } from '../user/user.entity';

@Injectable()
export class JoinChannelService
{
	constructor(@InjectRepository(JoinChannel) private joinChannelRepository: Repository<JoinChannel>,)
	{

	}

	findOneById(id: number): Promise<JoinChannel | null>
	{
		return (this.joinChannelRepository.findOneBy({ id }));
	}

	create(newJoin: JoinChannel)
	{
		return (this.joinChannelRepository.save(newJoin));
	}

	async remove(user: User, chanId: Channel)
	{
		let ret = await this.joinChannelRepository.createQueryBuilder()
			.delete()
			.from(JoinChannel)
			.where("channel = :id1 AND user = :id2", {id1: chanId, id2: user.id})
			.execute();
	}
}
