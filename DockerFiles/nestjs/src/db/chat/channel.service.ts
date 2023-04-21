import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Channel } from './chat.entity';

@Injectable()
export class ChannelService
{
	constructor(@InjectRepository(Channel) private channelRepository: Repository<Channel>,)
	{

	}

	findOneById(id: number): Promise<Channel | null>
	{
		return (this.channelRepository.findOneBy({ id }));
	}

	findOneByName(name: string): Promise<Channel | null>
	{
		return (this.channelRepository.findOneBy({ name }));
	}

	create(newChannel: Channel)
	{
		return (this.channelRepository.save(newChannel));
	}

	async delete(channelToDelete: Channel)
	{
		let ret = await this.channelRepository.createQueryBuilder("channel")
			.delete()
			.where("name = :id1", {id1: channelToDelete.name})
			.execute();
	}

	changePassword(chanId: number, newPassword: string)
	{
		return (this.channelRepository.update(chanId, {password: newPassword}));
	}
}
