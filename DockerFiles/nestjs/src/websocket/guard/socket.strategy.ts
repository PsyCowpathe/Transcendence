import { Injectable } from '@nestjs/common';

import { UserService} from '../../db/user/user.service';

@Injectable()
export class SocketStrategy
{
	constructor(private readonly userService : UserService)
	{

	}

	checkRequest(request : any) : Promise<boolean>
	{
		const promise = this.userService.findOneByToken(request)
		.then((user) =>
		{
			console.log("WSGuard1");
			if (user === null)
			{
			console.log("WSGuard2");
				return (false);
			}
			if (user.registered === false)
			{
			console.log("WSGuard3");
				return (false);
			}
			if (user.token === request)
				return (true);
			console.log("test1");
			return (false);
		})
		.catch((error) =>
		{
			console.log("Error 10");
			return (false);
		});
		return (promise);
	}
}


