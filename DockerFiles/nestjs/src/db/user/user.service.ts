import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Socket } from 'socket.io';

import { User } from './user.entity';

@Injectable()
export class UserService
{
	constructor(@InjectRepository(User) private usersRepository: Repository<User>,)
	{

	}

	findOneById(id: number): Promise<User | null>
	{
		return this.usersRepository.findOneBy({ id });
	}

	findOneByToken(token: string | undefined): Promise<User | null>
	{
		return this.usersRepository.findOneBy({ token });
	}

	findOneByName(name: string): Promise<User | null>
	{
		return this.usersRepository.findOneBy({ name });
	}
	
	findOneByUid(uid: number): Promise<User | null>
	{
		return this.usersRepository.findOneBy({ uid });
	}

	updateName(newName: string, user: User)
	{
		return this.usersRepository.update(user.id, {name: newName});
	}

	updateToken(token: string, user: User)
	{
		return this.usersRepository.update(user.id, {token: token});
	}

	updateRegister(bool: boolean, user: User)
	{
		return this.usersRepository.update(user.id, {registered: bool});
	}

	updateTwoFASecret(secret: string, user: User)
	{
		return this.usersRepository.update(user.id, {TwoFASecret: secret});
	}

	updateTwoFA(bool: boolean, user: User)
	{
		return this.usersRepository.update(user.id, {TwoFA: bool});
	}

	updateTwoFAToken(token: string, expire: string, user: User)
	{
		this.usersRepository.update(user.id, {TwoFAToken: token});
		return this.usersRepository.update(user.id, {TwoFAExpire: expire});
	}

	updateStatus(newStatus: string, user: User)
	{
		console.log("change status for " + user.name + " " + user.id);
		let ret = this.usersRepository.update(user.id, {Status: newStatus});
		console.log("DONE");
		return (ret);
	}

	async addMatch(user: User)
	{
		console.log("j´ajoute un match a " + user.name + " " + user.id);
		await this.usersRepository.createQueryBuilder("user")
		.update()
		.set({ Match: () => "Match + 1" })
		.where("id = :id", {id: user.id})
		.execute();
		console.log("DONE" + user.name);
	}

	async addVictory(user: User)
	{
		console.log("j´ajoute une victoire a " + user.name + " " + user.id);
		await this.usersRepository.createQueryBuilder("user")
		.update()
		.set({ Victory: () => "Victory + 1" })
		.where("id = :id", {id: user.id})
		.execute();
		console.log("DONE" + user.name);
	}

	async addDefeat(user: User)
	{
		console.log("j´ajoute une defaite a " + user.name + " " + user.id);
		await this.usersRepository.createQueryBuilder("user")
		.update()
		.set({ Defeat: () => "Defeat + 1" })
		.where("id = :id", {id: user.id})
		.execute();
		console.log("DONE" + user.name);
	}

	create(newUser : User)
	{
		return (this.usersRepository.save(newUser));
	}
}
