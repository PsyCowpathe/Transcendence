import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Channel, InviteList } from './chat.entity';
import { User } from '../user/user.entity';

@Injectable()
export class InviteListService
{
	constructor(@InjectRepository(InviteList) private inviteListRepository: Repository<InviteList>,)
	{

	}

	findOneById(id: number): Promise<InviteList | null>
	{
		return (this.inviteListRepository.findOneBy({ id }));
	}

	async findOneByInvite(channel: Channel, user: User): Promise<InviteList | null>
	{
		let ret = await this.inviteListRepository
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

	async getInvite(askMan: User) : Promise<InviteList[] | null>
	{
		let ret = await this.inviteListRepository
			.find
			({
				where:
				[
					{user: askMan}
				]
			});
		if (ret[0] === undefined)
			return (null);
		return (ret);
	}

	create(newInvite: InviteList)
	{
		return (this.inviteListRepository.save(newInvite));
	}

	async remove(user: User, chanId: Channel)
	{
		let ret = await this.inviteListRepository.createQueryBuilder("invite_list")
			.delete()
			.where("channel = :var1 AND user = :var2", {var1: chanId.id, var2: user.id})
			.execute();
	}

}
