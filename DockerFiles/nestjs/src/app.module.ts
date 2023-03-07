import { Module } from '@nestjs/common';

import { DbModule } from './db/db.module';
import { DbService } from './db/db.service';

import { UserModule } from './db/user/user.module';

import { AuthModule } from './auth/auth.module';

import { HomeModule } from './home/home.module';

import { RelationModule } from './db/relation/relation.module'; 

import { EventsModule } from './websocket/event.module'; 

@Module
({
	imports: [DbModule, UserModule, RelationModule, AuthModule, HomeModule, EventsModule],
})
export class AppModule
{

}
