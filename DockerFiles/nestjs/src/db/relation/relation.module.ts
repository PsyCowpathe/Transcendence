import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RelationService } from './relation.service';
import { Relation } from './relation.entity';

@Module
({
	imports: [TypeOrmModule.forFeature([Relation])],
	controllers: [],
	providers: [RelationService],
	exports: [RelationService],
})
export class RelationModule {}

