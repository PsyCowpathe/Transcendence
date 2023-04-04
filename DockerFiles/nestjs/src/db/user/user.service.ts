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

	updateTwoFAToken(token: string, expire: number, user: User)
	{
		this.usersRepository.update(user.id, {TwoFAToken: token});
		return this.usersRepository.update(user.id, {TwoFAExpire: expire});
	}

	create(newUser : User)
	{
		return (this.usersRepository.save(newUser));
	}
}
