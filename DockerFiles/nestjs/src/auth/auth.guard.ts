import { Res, Injectable, ExecutionContext, CanActivate, UnauthorizedException } from '@nestjs/common';

import { Observable } from 'rxjs';

import { AuthStrategy } from './auth.strategy';

@Injectable()
export class AuthGuard implements CanActivate
{
	constructor (private readonly authStrategy: AuthStrategy)
	{

	}

	async canActivate(context: ExecutionContext) : Promise<boolean>
	{
		const request = context.switchToHttp().getRequest();
		let ret = await this.authStrategy.checkRequest(request);
		if (ret === 1)
			return (true);
		console.log("ret =" + ret);
		if (ret === -1 || ret === -5)
			throw new UnauthorizedException("Invalid user");
		if (ret === -2)
			throw new UnauthorizedException("User not registered");
		if (ret === -3)
			throw new UnauthorizedException("Invalid 2FA token");
		if (ret === -4)
			throw new UnauthorizedException("Invalid Bearer token");
		return (false);
	}
}
