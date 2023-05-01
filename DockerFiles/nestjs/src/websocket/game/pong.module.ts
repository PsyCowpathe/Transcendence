import { Module } from '@nestjs/common'
import { UserModule } from '../../db/user/user.module'
import { WsStatusModule } from '../status/wsstatus.module'
import { PongGateway } from './pong.gateway'
import { SocketStrategy } from '../guard/socket.strategy'
import { GameModule } from '../../db/game/game.module';
import { RelationModule } from '../../db/relation/relation.module';

@Module({
	providers: [PongGateway, SocketStrategy],
	imports: [UserModule, WsStatusModule, GameModule, RelationModule], 
})

export class PongModule {}

