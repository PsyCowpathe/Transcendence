import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Private } from './chat.entity';
import { User } from '../user/user.entity';

@Injectable()
export class PrivateService
{
    constructor(@InjectRepository(Private) private privateRepository: Repository<Private>,)
	{

	}

    create(newPrivate: Private)
	{
		return (this.privateRepository.save(newPrivate));
	}

	async findOneByPrivate(user1: User, user2: User): Promise<Private[] | null>
	{
		let ret = await this.privateRepository
			.find
			({
				where:
				[
					{user1: user1, user2: user2},
					{user1: user2, user2: user1},
				],
				order:
				{
					id: "ASC",
				},
			});
			if (ret[0] === undefined)
				return (null);
			return (ret);
	}
}
