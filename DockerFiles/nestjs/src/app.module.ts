import { Module } from '@nestjs/common';

import { DbModule } from './db/db.module';
import { DbService } from './db/db.service';

import { UserModule } from './db/user/user.module';

import { AuthModule } from './auth/auth.module';

import { RelationModule } from './db/relation/relation.module'; 

import { WsRelationModule } from './websocket/relation/wsrelation.module'; 

import { ChatModule } from './db/chat/chat.module'; 

import { WsChatModule } from './websocket/chat/wschat.module';

@Module
({
	imports:
	[
		DbModule, UserModule, RelationModule, AuthModule,
		WsRelationModule, ChatModule, WsChatModule
	],
})
export class AppModule
{

}