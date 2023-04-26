import { Module } from '@nestjs/common';
import { WsStatusGateway } from './wsstatus.gateway';

import { SocketStrategy } from '../guard/socket.strategy';

import { UserModule } from '../../db/user/user.module';
import { RelationModule } from '../../db/relation/relation.module';

import { WsStatusService } from './wsstatus.service';

@Module
({
	imports: [UserModule, RelationModule],
	providers: [WsStatusGateway, SocketStrategy, WsStatusService],
	exports:	[WsStatusService],
})
export class WsStatusModule
{

}
