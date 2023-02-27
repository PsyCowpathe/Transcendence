import { Module } from '@nestjs/common';

import { DbController } from './db/db.controller';
import { DbModule } from './db/db.module';
import { DbService } from './db/db.service';

import { UserModule } from './db/user/user.module';

import { AuthModule } from './auth/auth.module';

@Module
({
	imports: [DbModule, UserModule, AuthModule],
})
export class AppModule
{

}
