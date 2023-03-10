import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChannelService } from './channel.service';
import { Channel, Bans, Mutes, Admins, JoinChannel } from './chat.entity';

@Module
({
	imports: [TypeOrmModule.forFeature([Channel, Bans, Mutes, Admins, JoinChannel])],
	controllers: [],
	providers: [ChannelService],
	exports: [ChannelService],
})
export class ChatModule {}

