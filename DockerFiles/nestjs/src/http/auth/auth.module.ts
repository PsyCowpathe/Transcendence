import { Module, NestModule, RequestMethod, MiddlewareConsumer } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthStrategy } from '../guard/auth.strategy';

import { UserModule } from '../../db/user/user.module';

@Module
({
	imports: [UserModule],
	controllers: [AuthController],
	providers: [AuthService, AuthStrategy],
	exports: [AuthService],
})
export class AuthModule
{

}
