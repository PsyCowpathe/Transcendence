import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

	findOneByToken(token: string): Promise<User | null>
	{
		return this.usersRepository.findOneBy({ token });
	}

	findOneByName(name: string): Promise<User | null>
	{
		return this.usersRepository.findOneBy({ name });
	}

	updateName(newName: string, user: User)
	{
		return this.usersRepository.update(user.id, {name: newName});
	}

	create(newUser : User)
	{
		const ret = this.usersRepository.save(newUser)
	}
}
