import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChannelService } from './channel.service';
import { AdminsService } from './admins.service';
import { BansService } from './bans.service';
import { MutesService } from './mutes.service';
import { JoinChannelService } from './joinchannel.service';
import { InviteListService } from './invitelist.service';
import { MessageService } from './message.service';

import { Channel, Bans, Mutes, Admins, JoinChannel, InviteList, Message } from './chat.entity';

@Module
({
	imports: [TypeOrmModule.forFeature([Channel, Bans, Mutes, Admins, JoinChannel, InviteList, Message])],
	controllers: [],
	providers: [ChannelService, AdminsService, BansService, MutesService, JoinChannelService, InviteListService, MessageService],
	exports: [ChannelService, AdminsService, JoinChannelService, InviteListService, BansService, MutesService, MessageService],
})
export class ChatModule {}