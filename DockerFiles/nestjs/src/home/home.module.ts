import { Module } from '@nestjs/common';

import { HomeController } from './home.controller';
import { HomeService } from './home.service';

import { RelationModule } from '../db/relation/relation.module';
import { UserModule } from '../db/user/user.module';

@Module
({
	imports: [RelationModule, UserModule],
	controllers: [HomeController],
	providers: [HomeService],
})
export class HomeModule
{

}
