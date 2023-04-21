import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Relation } from './relation.entity';
import { User } from '../user/user.entity';

/*
 * XV		= User1 a bloquer User2
 * VX		= User2 a bloquer User1
 * enemy	= Les deux users se sont ignoré
 * neutral 	= Les deux users sont neutre
 * +-		= User1 a demander User2 en amis
 * -+		= User2 a demander User1 en amis
 * ++		= Les deux users on demander l'amitié
 * ally		= Les deux users sont amis
 */

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

	async getRelationStatus(id1: User, id2: User) : Promise<string>
	{
		let ret = await this.relationRepository
			.find
			({
				where:
				[
					{user1: id1, user2: id2},
					{user1: id2, user2: id1},
				]
			});
		if (ret[0] === undefined)
			return ("neutral");
		if (ret[0].type === -1 && ret[1].type === -1)
			return ("enemy");
		else if (ret[0].type === -1)
		{
			if (ret[0].user1.id === id1.id)
				return ("XV");
			return ("VX");
		}
		else if (ret[1].type === -1)
		{
			if (ret[1].user1.id === id1.id)
				return ("XV");
			return ("VX");
		}
		else if (ret[0].type === 2)
			return ("ally");
		else if (ret[0].type === 1 && ret[1].type === 1)
			return ("++");
		else if (ret[0].type === 0 && ret[1].type === 1)
		{
			if (ret[1].user2.id === id1.id)
				return ("-+")
			return ("+-")
		}
		else if (ret[0].type === 1 && ret[1].type === 0)
		{
			if (ret[0].user2.id === id1.id)
				return ("-+")
			return ("+-")
		}
		else
			return ("neutral");
	}

	async getAnnoyedUser(annoyingMan: User) : Promise<Relation[] | null>
	{
		let ret = await this.relationRepository
			.find
			({
				where:
				[
					{type: -1, user2: annoyingMan}
				]
			});
		if (ret[0] === undefined)
			return (null);
		return (ret);
	}

	async getAnnoyingUser(annoyedMan: User) : Promise<Relation[] | null>
	{
		let ret = await this.relationRepository
			.find
			({
				where:
				[
					{type: -1, user1: annoyedMan}
				]
			});
		if (ret[0] === undefined)
			return (null);
		return (ret);
	}

	async getFriendUser(user: User) : Promise<Relation[] | null>
	{
		let ret = await this.relationRepository
			.find
			({
				where:
				[
					{type: 2, user1: user}
				]
			});
		if (ret[0] === undefined)
			return (null);
		return (ret);
	}

	async getFriendRequest(user: User) : Promise<Relation[] | null>
	{
		let ret = await this.relationRepository
			.find
			({
				where:
				[
					{type: 1, user2: user}
				]
			});
		if (ret[0] === undefined)
			return (null);
		return (ret);
	}

	async doesRelationExist(id1: User, id2: User) : Promise<boolean>
	{
		let ret = await this.relationRepository
			.find
			({
				where:
				[
					{user1: id1, user2: id2},
					{user1: id2, user2: id1},
				]
			});
		if (ret[0] === undefined && ret[1] === undefined)
			return (false);
		return (true);
	}


/*
* -1	= Bloqué
* 0 	= Neutre
* 1 	= Demande
* 2 	= Amis
*/

	async createRequest(sender: User, receiver: User)
	{
		let ret = await this.relationRepository.createQueryBuilder()
			.update(Relation)
			.where("user1 = :id1 AND user2 = :id2", {id1: sender.id, id2: receiver.id})
			.set({type:1})
			.execute();
		if (ret.affected === 0)
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
				.where("user1 = :id1 AND user2 = :id2 AND type = 2", {id1: annoyingMan.id, id2: angryMan.id})
				.set({type:0})
				.execute();
		}
	}

	async unIgnore(forgivingMan: User, forgivedMan: User)
	{

		let ret = await this.relationRepository.createQueryBuilder()
			.update(Relation)
			.where("user1 = :id1 AND user2 = :id2", {id1: forgivingMan.id, id2: forgivedMan.id})
			.set({type:0})
			.execute();
	}

	async deleteFriend(deletor: User, victim: User)
	{
		let ret = await this.relationRepository.createQueryBuilder()
			.update(Relation)
			.where("user1 = :id1 AND user2 = :id2", {id1: deletor.id, id2: victim.id})
			.set({type:0})
			.execute();
		if (ret.affected === 0)
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
		else
		{
			let ret = await this.relationRepository.createQueryBuilder()
				.update(Relation)
				.where("user1 = :id1 AND user2 = :id2", {id1: victim.id, id2: deletor.id})
				.set({type:0})
				.execute();
		}
	}
}
