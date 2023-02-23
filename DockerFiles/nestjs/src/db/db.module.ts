import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DbController } from './db.controller';
import { DbService } from './db.service'

import { User } from './user/user.entity';

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
			password: 'daddy', //remove !!
      		database: 'postgres',
      		entities: [User],
			synchronize: true,
		}),
	],
	controllers: [DbController],
	providers: [DbService],
})
export class DbModule {}
