import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GameService } from './game.service';
import { MatchHistory } from './game.entity'

@Module
({
	imports: [TypeOrmModule.forFeature([MatchHistory])],
	controllers: [],
	providers: [GameService],
	exports: [GameService],
})
export class GameModule {}
