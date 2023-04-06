import { Injectable, ExecutionContext, CanActivate, UnauthorizedException } from '@nestjs/common';

import { Observable } from 'rxjs';

import { SocketStrategy } from './socket.strategy';

@Injectable()
export class SocketGuard implements CanActivate
{
	constructor (private readonly socketStrategy: SocketStrategy)
	{

	}

	async canActivate(context: any) : Promise<boolean>
	{
		console.log('Socket Guard');
		//console.log(context.args[0].handshake);
		//console.log(context.args[0].handshake.auth.token);
		const tokenBearer = context.args[0].handshake.auth.token;
		const twoFAToken = context.args[0].handshake.auth.twofatoken;
		let ret = await this.socketStrategy.checkRequest(tokenBearer, twoFAToken);
		if (ret === 1)
			return (true);
		if (ret === -1)
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

