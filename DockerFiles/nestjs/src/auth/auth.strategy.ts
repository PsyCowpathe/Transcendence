import { Injectable} from '@nestjs/common';

import { Observable } from 'rxjs';

import { UserService} from '../db/user/user.service';


@Injectable()
export class AuthStrategy
{
	constructor(private readonly userService : UserService)
	{

	}

	async checkRequest(request : any) : Promise<number>
	{
		//console.log(request, { depth: null });
		const user = await this.userService.findOneByToken(request.headers.authorization);
		if (user === null)
		{
			return (-1);
		}
		if (request.route.path !== "/auth/loginchange" && user.registered === false)
		{
			return (-2);
		}
		if (user.token === request.headers.authorization)
		{
			/*if (user.TwoFA === true)
			{
				if (Date.now() > user.TwoFAExpire)
					return (-3);
				if (request.headers.TwoFAToken === user.TwoFAToken)
					return (true);
				return (-3);
			}
			else
			{*/
				return (1);
		//	}
		}
		return (-4);
	}
}
