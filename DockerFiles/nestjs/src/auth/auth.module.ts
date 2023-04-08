import { Module, NestModule, RequestMethod, MiddlewareConsumer } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthStrategy } from './auth.strategy';

import { UserModule } from '../db/user/user.module';
import { ChatModule } from '../db/chat/chat.module';
import { RelationModule } from '../db/relation/relation.module';

//import { HttpsRedirectMiddleware } from './auth.middleware';

@Module
({
	imports: [UserModule, ChatModule, RelationModule],
	controllers: [AuthController],
	providers: [AuthService, AuthStrategy],
})
export class AuthModule
{
	/*configure(consumer: MiddlewareConsumer)
	{
    consumer.apply(HttpsRedirectMiddleware).forRoutes("auth");
	}*/
	/*	configure(consumer: MiddlewareConsumer)
	{
   		 consumer
   	   	.apply(CorsMiddleware)
		.forRoutes({path: '*', method: RequestMethod.ALL});
	}*/
}
