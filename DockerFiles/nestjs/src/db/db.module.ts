import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './user/user.entity';

import { Relation } from './relation/relation.entity';

import { Channel, Bans, Mutes, Admins, JoinChannel, InviteList, Message, Private } from './chat/chat.entity';

import { MatchHistory } from './game/game.entity';

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
			password: process.env.DB_PSWD,
      		database: 'postgres',
      		entities:
			[
				User, Relation, Channel, Bans,
				Mutes, Admins, JoinChannel, InviteList,
				Message, Private, MatchHistory
			],
			synchronize: true,
		}),
	],
	controllers: [],
})
export class DbModule {}
