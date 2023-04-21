import { Injectable, ExecutionContext, CanActivate, UnauthorizedException, ForbiddenException } from '@nestjs/common';

import { Observable } from 'rxjs';

import { SocketStrategy } from './socket.strategy';

@Injectable()
export class SocketGuard implements CanActivate
{
	constructor (private readonly socketStrategy: SocketStrategy)
	{

	}

	async canActivate(context: ExecutionContext) : Promise<boolean>
	{
		const tokenBearer = context.getArgs()[0].handshake.auth.token;
		const twoFAToken = context.getArgs()[0].handshake.auth.twoFAToken;
		let ret = await this.socketStrategy.checkRequest(tokenBearer, twoFAToken);
		if (ret === 1)
			return (true);
		if (ret === -1)
			throw new UnauthorizedException("Invalid user");
		if (ret === -2)
			throw new ForbiddenException("User not registered");
		if (ret === -3)
			throw new ForbiddenException("Invalid 2FA token");
		if (ret === -4)
			throw new UnauthorizedException("Invalid Bearer token");
		return (false);
	}
}
