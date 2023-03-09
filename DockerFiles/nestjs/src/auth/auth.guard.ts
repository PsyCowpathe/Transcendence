import { Res, Injectable, ExecutionContext, CanActivate} from '@nestjs/common';

import { Observable } from 'rxjs';

import { AuthStrategy } from './auth.strategy';

@Injectable()
export class AuthGuard implements CanActivate
{
	constructor (private readonly authStrategy: AuthStrategy)
	{

	}

	canActivate(context: ExecutionContext) : boolean | Promise<boolean> | Observable<boolean>
	{
		console.log('Auth Guard');
		const request = context.switchToHttp().getRequest();
		return (this.authStrategy.checkRequest(request));
	}
}
