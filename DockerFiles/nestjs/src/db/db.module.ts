import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DbService } from './db.service'

import { User } from './user/user.entity';

import { Relation } from './relation/relation.entity';

@Module
({
	imports:
	[
		TypeOrmModule.forRoot
		({
      		type: 'postgres',
      		host: 'postgres',
      		port: 5432,
      		username: 'postgres',
			password: process.env.DB_PSWD, //remove !!
      		database: 'postgres',
      		entities: [User, Relation],
			synchronize: true,
		}),
	],
	controllers: [],
	providers: [DbService],
})
export class DbModule {}
