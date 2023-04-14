import { Module } from '@nestjs/common'
import { UserModule } from '../../db/user/user.module'
import { PongController } from './pong.controller'
import { PongService } from './pong.service'

@Module({
	controllers: [PongController],
	providers: [PongService],
	imports: [UserModule], 
})

export class PongModule {}
