import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Channel, Message } from './chat.entity';

@Injectable()
export class MessageService
{
    constructor(@InjectRepository(Message) private messageRepository: Repository<Message>,)
	{

	}

    create(newMessage: Message)
	{
		return (this.messageRepository.save(newMessage));
	}

	async findOneByChannel(channel: Channel): Promise<Message[] | null>
	{
		let ret = await this.messageRepository
			.find
			({
				where:
				{
					channel: channel,
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
}
