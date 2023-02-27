import { Module, NestModule, RequestMethod, MiddlewareConsumer } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

//import { HttpsRedirectMiddleware } from './auth.middleware';

@Module
({
	imports: [],
	controllers: [AuthController],
	providers: [AuthService],
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
