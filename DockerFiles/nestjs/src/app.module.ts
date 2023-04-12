import { Module } from '@nestjs/common';

import { DbModule } from './db/db.module';

import { UserModule } from './db/user/user.module';

import { AuthModule } from './http/auth/auth.module';

import { MainModule } from './http/main/main.module';

import { RelationModule } from './db/relation/relation.module'; 

import { WsRelationModule } from './websocket/relation/wsrelation.module'; 

import { ChatModule } from './db/chat/chat.module'; 

import { WsChatModule } from './websocket/chat/wschat.module';

@Module
({
	imports:
	[
		DbModule, UserModule, RelationModule, AuthModule, MainModule,
		WsRelationModule, ChatModule, WsChatModule
	],
})
export class AppModule
{

}
