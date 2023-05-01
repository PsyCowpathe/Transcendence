import { Injectable } from '@nestjs/common';

import { UserService} from '../../db/user/user.service';

@Injectable()
export class SocketStrategy
{
	constructor(private readonly userService : UserService)
	{

	}

	async checkRequest(tokenBearer: string, twoFAToken: string) : Promise<number>
	{
		const user = await this.userService.findOneByToken(tokenBearer);
		if (user === null)
			return (-1);
		if (user.registered === false)
			return (-2);
		if (user.token === tokenBearer)
		{
			if (user.TwoFA === true)
			{
				if (Date.now().toString() > user.TwoFAExpire)
					return (-3);
				if (twoFAToken === user.TwoFAToken)
					return (1);
				return (-3);
			}
			else
				return (1);
		}
		return (-4);
	}
}
