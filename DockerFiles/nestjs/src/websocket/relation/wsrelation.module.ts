import { Module } from '@nestjs/common';
import { WsRelationGateway } from './wsrelation.gateway';

import { SocketStrategy } from '../guard/socket.strategy';

import { UserModule } from '../../db/user/user.module';

@Module
({
	imports: [UserModule],
	providers: [WsRelationGateway, SocketStrategy],
})
export class WsRelationModule {}
