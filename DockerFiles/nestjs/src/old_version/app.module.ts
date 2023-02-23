"use strict"

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
//import { TypeOrmModule } from '@nestjs/typeorm';
//import typeOrmConfig from './typeorm.config';
 
import { NewController } from './app.controller';

import { NewService } from './app.service';

@Module({
	imports: [HttpModule],
	controllers: [NewController],
	providers: [NewService],
})
export class NewModule {}
