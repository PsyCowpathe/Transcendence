import { Module } from '@nestjs/common';
import { WsChatGateway } from './wschat.gateway';

import { SocketStrategy } from '../guard/socket.strategy';

import { UserModule } from '../../db/user/user.module';
import { ChatModule } from '../../db/chat/chat.module';

import { WsChatService } from './wschat.service';

@Module
({
	imports: [UserModule, ChatModule],
	providers: [WsChatGateway, SocketStrategy, WsChatService],
})
export class WsChatModule {}

