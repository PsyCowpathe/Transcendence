import { Module } from '@nestjs/common'
import { UserModule } from '../../db/user/user.module'
import { WsStatusModule } from '../status/wsstatus.module'
import { PongGateway } from './pong.gateway'
import { SocketStrategy } from '../guard/socket.strategy'
import { GameModule } from '../../db/game/game.module';

@Module({
	providers: [PongGateway, SocketStrategy],
	imports: [UserModule, WsStatusModule, GameModule], 
})

export class PongModule {}

