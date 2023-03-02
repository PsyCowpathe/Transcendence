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
		console.log('jsuis dans lstartegy');
		console.log("strat = " + request.cookies.token);
		const promise = this.userService.findOneByToken(request.cookies.token)
		.then((user) =>
		{
			if (user === null)
				return (true);
			else if (user.token === request.cookies.tolen)
				return (true);
			return (true);
		})
		.catch((error) =>
		{
			console.log("Error 10");
			return (error);
		});
		return (promise);
	}
}
