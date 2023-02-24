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

	findOne(id: number): Promise<User | null>
	{
		console.log('findOne');
		return this.usersRepository.findOneBy({ id });
	}

	create(newUser : User)
	{
		const ret = this.usersRepository.save(newUser)
	}
}