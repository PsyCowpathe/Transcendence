import { Module, NestModule, RequestMethod, MiddlewareConsumer } from '@nestjs/common';

import { MainController } from './main.controller';
import { MainService } from './main.service';
import { AuthStrategy } from '../guard/auth.strategy';

import { UserModule } from '../../db/user/user.module';
import { ChatModule } from '../../db/chat/chat.module';
import { RelationModule } from '../../db/relation/relation.module';
import { GameModule } from '../../db/game/game.module';
import { AuthModule } from '../auth/auth.module';

@Module
({
	imports: [UserModule, ChatModule, RelationModule, AuthModule, GameModule],
	controllers: [MainController],
	providers: [MainService, AuthStrategy],
})
export class MainModule
{

}
