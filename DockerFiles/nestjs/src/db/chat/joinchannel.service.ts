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

	async findOneByJoined(channel: Channel, user: User): Promise<JoinChannel | null>
	{

		let ret = await this.joinChannelRepository
			.find
			({
				where:
				[
					{channel: channel, user: user}
				]
			});
		if (ret[0] === undefined)
			return (null);
		return (ret[0]);
	}

	async getUser(channel: Channel): Promise<JoinChannel[] | null>
	{
		let ret = await this.joinChannelRepository
			.find
			({
				where:
				[
					{channel: channel}
				]
			});
		if (ret[0] === undefined)
			return (null);
		return (ret);
	}

	async getJoinedChannel(user: User): Promise<JoinChannel[] | null>
	{
		let ret = await this.joinChannelRepository
				.find
				({
					where:
					{
						user: user,
					},
					order:
					{
						id: "DESC",
					},
				});
		if (ret[0] === undefined)
			return (null);
		return (ret);
	}

	create(newJoin: JoinChannel)
	{
		return (this.joinChannelRepository.save(newJoin));
	}

	async remove(user: User, chanId: Channel)
	{
		let ret = await this.joinChannelRepository.createQueryBuilder("join_channel")
			.delete()
			.where("channel = :id1 AND user = :id2", {id1: chanId.id, id2: user.id})
			.execute();
	}
}
