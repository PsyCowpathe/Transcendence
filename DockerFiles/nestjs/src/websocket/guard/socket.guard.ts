import { Injectable, ExecutionContext, CanActivate} from '@nestjs/common';

import { Observable } from 'rxjs';

import { SocketStrategy } from './socket.strategy';

@Injectable()
export class SocketGuard implements CanActivate
{
	constructor (private readonly socketStrategy: SocketStrategy)
	{

	}

	canActivate(context: any) : boolean | Promise<boolean> | Observable<boolean>
	{
		console.log('Socket Guard');
		//console.log(context.args[0].handshake);
		//console.log(context.args[0].handshake.auth.token);
		const request = context.args[0].handshake.auth.token;
		return (this.socketStrategy.checkRequest(request));
	}
}

