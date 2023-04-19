import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Channel, Admins } from './chat.entity';
import { User } from '../user/user.entity';

@Injectable()
export class AdminsService
{
	constructor(@InjectRepository(Admins) private adminsRepository: Repository<Admins>,)
	{

	}

	findOneById(id: number): Promise<Admins | null>
	{
		return (this.adminsRepository.findOneBy({ id }));
	}

	async findOneByAdmin(channel: Channel, admin: User): Promise<Admins | null>
	{
		let ret = await this.adminsRepository
			.find
			({
				where:
				[
					{channel: channel, user: admin}
				]
			});
			if (ret[0] === undefined)
				return (null);
			return (ret[0]);
	}

	create(newAdmin: Admins)
	{
		return (this.adminsRepository.save(newAdmin));
	}

	async remove(user: User, chanId: Channel)
	{

		let ret = await this.adminsRepository.createQueryBuilder("admins")
			.delete()
			.where("channel = :id1 AND user = :id2", {id1: chanId.id, id2: user.id})
			.execute();
	}
}
