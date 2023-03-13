import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Channel } from './chat.entity';
import { User } from '../user/user.entity';

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

	delete(channelToDelete: Channel)
	{
		return (this.channelRepository.delete(channelToDelete));
	}

	changeChannelName(chanId: number, newName: string)
	{
		return (this.channelRepository.update(chanId, {name: newName}));
	}

	changePassword(chanId: number, newPassword: string)
	{
		return (this.channelRepository.update(chanId, {password: newPassword}));
	}
}
