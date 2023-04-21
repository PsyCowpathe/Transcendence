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
		console.log("Updating status");
		let ret = this.usersRepository.update(user.id, {Status: newStatus});
		console.log(ret);
		return (ret);
	}

	async addMatch(newStatus: string, user: User)
	{
		await this.usersRepository.createQueryBuilder()
		.update(User)
		.set({ Match: () => "Match + 1" })
		.execute();
	}

	async addVictory(newStatus: string, user: User)
	{
		await this.usersRepository.createQueryBuilder()
		.update(User)
		.set({ Victory: () => "Victory + 1" })
		.execute();
	}

	async addDefeat(newStatus: string, user: User)
	{
		await this.usersRepository.createQueryBuilder()
		.update(User)
		.set({ Defeat: () => "Defeat + 1" })
		.execute();
	}

	create(newUser : User)
	{
		return (this.usersRepository.save(newUser));
	}
}
