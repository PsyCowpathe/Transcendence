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
			if (user === null)
				return (false);
			if (user.registered === false)
				return (false);
			if (user.token === request)
				return (true);
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


