import { Module } from '@nestjs/common'
import { UserModule } from '../db/user/user.module'
import { PongController } from './pong.controller'
import { PongService } from './pong.service'
import { PongGateway } from './pong.gateway'

@Module({
	controllers: [PongController],
	providers: [PongService, PongGateway],
	imports: [UserModule], 
	exports: [PongService, PongGateway],
})

export class PongModule {}
