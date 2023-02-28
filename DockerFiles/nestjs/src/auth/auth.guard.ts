import { Res, Injectable, ExecutionContext, CanActivate } from '@nestjs/common';

import { AuthStrategy } from './auth.strategy';

@Injectable()
export class AuthGuard implements CanActivate
{
	constructor (private readonly authStrategy: AuthStrategy)
	{

	}

	canActivate(context: ExecutionContext) : boolean
	{
		console.log('jsuis dans lguard');
		const request = context.switchToHttp().getRequest();
		return (this.authStrategy.checkRequest(request));
	}
}
