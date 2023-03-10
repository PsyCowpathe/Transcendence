import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Channel, Admins } from './chat.entity';
import { User } from '../user/user.entity';

@Injectable()
export class AdminService
{
	constructor(@InjectRepository(Admins) private adminsRepository: Repository<Admins>,)
	{

	}

	findOneById(id: number): Promise<Admins | null>
	{
		return (this.adminsRepository.findOneBy({ id }));
	}

	create(newAdmin: Admins)
	{
		return (this.adminsRepository.save(newAdmin));
	}

	async remove(user: User, chanId: Channel)
	{
		let ret = await this.adminsRepository.createQueryBuilder()
			.delete()
			.from(Admins)
			.where("channel = :id1 AND user = :id2", {id1: chanId, id2: user.id})
			.execute();
	}
}
