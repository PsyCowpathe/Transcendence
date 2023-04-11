import { Injectable} from '@nestjs/common';

import { UserService} from '../db/user/user.service';

@Injectable()
export class AuthStrategy
{
	constructor(private readonly userService : UserService)
	{

	}


	async checkRequest(request : any) : Promise<number>
	{
		console.log("token =") 
		console.log(request.headers.authorization);
		console.log("2fatoken =") 
		console.log(request.headers.twofatoken);
		const user = await this.userService.findOneByToken(request.headers.authorization);
		if (user === null)
			return (-1);
		if (request.route.path !== "/auth/loginchange" && user.registered === false)
			return (-2);
		if (user.token === request.headers.authorization)
		{
			if (user.TwoFA === true)
			{
				if (Date.now().toString() > user.TwoFAExpire)
					return (-3);
				if (request.headers.twofatoken === user.TwoFAToken)
					return (1);
				return (-3);
			}
			else
				return (1);
		}
		return (-4);
	}
}
