import { Module } from '@nestjs/common';

import { DbModule } from './db/db.module';
import { DbService } from './db/db.service';

import { UserModule } from './db/user/user.module';

import { AuthModule } from './auth/auth.module';

import { HomeModule } from './home/home.module';

import { RelationModule } from './db/relation/relation.module'; 

import { WsRelationModule } from './websocket/relation/wsrelation.module'; 

import { PongModule } from './pong/pong.module';

@Module
({
	imports: [DbModule, UserModule, RelationModule, AuthModule, HomeModule, WsRelationModule, PongModule],
})
export class AppModule
{

}
