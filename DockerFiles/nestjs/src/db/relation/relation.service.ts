import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Relation } from './relation.entity';
import { User } from '../user/user.entity';

@Injectable()
export class RelationService
{
	constructor(@InjectRepository(Relation) private relationRepository: Repository<Relation>,)
	{

	}

	findOneById(id: number): Promise<Relation | null>
	{
		return this.relationRepository.findOneBy({ id });
	}

	/*
	 * -1 = Bloqué
	 * 0 = Neutre
	 * 1 = Demande
	 * 2 = Amis
	 */

	async createRequest(sender: User, receiver: User)
	{
		let newRelation1: Relation = new Relation();
		let newRelation2: Relation = new Relation();

		newRelation1.user1 = sender;
		newRelation1.user2 = receiver;
		newRelation1.type = 1;
		await this.relationRepository.save(newRelation1);

		newRelation2.user1 = receiver;
		newRelation2.user2 = sender;
		newRelation2.type = 0;
		await this.relationRepository.save(newRelation2);
	}

	async acceptRequest(yesMan: User, askMan: User)
	{
		await this.relationRepository.createQueryBuilder()
			.update(Relation)
			.where("user1 = :id1 AND user2 = :id2 AND type = 1", {id1: askMan.id, id2: yesMan.id})
			.set({type:2})
			.execute();
		await this.relationRepository.createQueryBuilder()
			.update(Relation)
			.where("user1 = :id1 AND user2 = :id2 AND (type = 0 OR type = 1)", {id1: yesMan.id, id2: askMan.id})
			.set({type:2})
			.execute();
	}

	async refuseRequest(noMan: User, askMan: User)
	{
		await this.relationRepository.createQueryBuilder()
			.update(Relation)
			.where("user1 = :id1 AND user2 = :id2 AND type = 1", {id1: askMan.id, id2: noMan.id})
			.set({type:0})
			.execute();
	}

	async Ignore(angryMan: User, annoyingMan: User)
	{

		let ret = await this.relationRepository.createQueryBuilder()
			.update(Relation)
			.where("user1 = :id1 AND user2 = :id2", {id1: angryMan.id, id2: annoyingMan.id})
			.set({type:-1})
			.execute();
		if (ret.affected === 0)
		{
			let newRelation1: Relation = new Relation();
			let newRelation2: Relation = new Relation();

			newRelation1.user1 = angryMan;
			newRelation1.user2 = annoyingMan;
			newRelation1.type = -1;
			await this.relationRepository.save(newRelation1);

			newRelation2.user1 = annoyingMan;
			newRelation2.user2 = angryMan;
			newRelation2.type = 0;
			await this.relationRepository.save(newRelation2);
		}
		else
		{
			await this.relationRepository.createQueryBuilder()
				.update(Relation)
				.where("user1 = :id1 AND user2 = :id2", {id1: annoyingMan.id, id2: angryMan.id})
				.set({type:0})
				.execute();
		}

	}

	async deleteFriend(deletor: User, victim: User)
	{
		await this.relationRepository.createQueryBuilder()
			.update(Relation)
			.where("user1 = :id1 AND user2 = :id2 AND type = 2", {id1: deletor.id, id2: victim.id})
			.set({type:0})
			.execute();
		await this.relationRepository.createQueryBuilder()
			.update(Relation)
			.where("user1 = :id1 AND user2 = :id2 AND type = 2", {id1: victim.id, id2: deletor.id})
			.set({type:0})
			.execute();
	}
}

