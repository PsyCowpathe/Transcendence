import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

import { AuthStrategy } from '../auth/auth.strategy';


@Module({
  providers: [EventsGateway, SocketStrategy],
})
export class EventsModule {}
