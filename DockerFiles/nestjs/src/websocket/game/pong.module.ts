import { Module } from '@nestjs/common'
import { UserModule } from '../../db/user/user.module'
import { WsStatusModule } from '../status/wsstatus.module'
import { PongGateway } from './pong.gateway'
import { SocketStrategy } from '../guard/socket.strategy'

@Module({
	providers: [PongGateway, SocketStrategy],
	imports: [UserModule, WsStatusModule], 
})

export class PongModule {}

