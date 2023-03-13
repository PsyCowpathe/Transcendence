import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChannelService } from './channel.service';
import { AdminsService } from './admins.service';
import { BansService } from './bans.service';
import { MutesService } from './mutes.service';
import { JoinChannelService } from './joinchannel.service';

import { Channel, Bans, Mutes, Admins, JoinChannel } from './chat.entity';

@Module
({
	imports: [TypeOrmModule.forFeature([Channel, Bans, Mutes, Admins, JoinChannel])],
	controllers: [],
	providers: [ChannelService, AdminsService, BansService, MutesService, JoinChannelService],
	exports: [ChannelService, AdminsService, JoinChannelService],
})
export class ChatModule {}

