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
		console.log(request);
		const promise = this.userService.findOneByToken(request.cookies.token)
		.then((user) =>
		{
			if (user === null)
			{
				console.log('false 1');
				return (true);
			}
			else if (user.token === request.cookies.tolen)
			{
				console.log('true');
				return (true);
			}
			console.log('false 2');
			return (true);
		})
		.catch((error) =>
		{
			console.log("Error 10");
			console.log(error);
			return (error);
		});
		return (promise);
	}
}
