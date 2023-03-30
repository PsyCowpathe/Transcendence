import { Injectable} from '@nestjs/common';

import { Observable } from 'rxjs';

import { UserService} from '../db/user/user.service';


@Injectable()
export class AuthStrategy
{
	constructor(private readonly userService : UserService)
	{

	}

	checkRequest(request : any) : Promise<boolean>
	{
		//console.log(request, { depth: null });
		const promise = this.userService.findOneByToken(request.headers.authorization)
		.then((user) =>
		{
			if (user === null)
				{
					console.log("blbl");
				return (false);
				}
			if (request.route.path !== "/auth/loginchange" && user.registered === false)
				{
					console.log("bloblo");
				return (false);
				}
			if (user.token === request.headers.authorization)
				{
					console.log("blabla");
				return (true);
				}
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
