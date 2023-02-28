import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthStrategy
{
	checkRequest(request : any) : boolean
	{
		console.log('jsuis dans lstartegy');
		console.log(request);
		return (true);
	}
}
