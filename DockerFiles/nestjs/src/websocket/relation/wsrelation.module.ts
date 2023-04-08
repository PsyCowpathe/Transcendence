import { Module } from '@nestjs/common';
import { WsRelationGateway } from './wsrelation.gateway';

import { SocketStrategy } from '../guard/socket.strategy';

import { UserModule } from '../../db/user/user.module';
import { RelationModule } from '../../db/relation/relation.module';

import { WsRelationService } from './wsrelation.service';

@Module
({
	imports: [UserModule, RelationModule],
	providers: [WsRelationGateway, SocketStrategy, WsRelationService],
})
export class WsRelationModule {}
