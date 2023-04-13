import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GameService } from './game.service';
import { Game } from './game.entity'

@Module
({
	imports: [TypeOrmModule.forFeature([Game])],
	controllers: [],
	providers: [GameService],
	exports: [GameService],
})
export class RelationModule {}