import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GameService } from './game.service';
import { MatchHistory, MatchMaking } from './game.entity'

@Module
({
	imports: [TypeOrmModule.forFeature([MatchHistory, MatchMaking])],
	controllers: [],
	providers: [GameService],
	exports: [GameService],
})
export class GameModule {}
