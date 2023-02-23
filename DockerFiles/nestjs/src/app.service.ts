import { Injectable } from '@nestjs/common';
import { Response } from 'express'

function blbl(arg1 : string) : Number
{
		console.log('dans la fonction = ' + arg1);
	return 1;
}
	

@Injectable()
export class AppService
{	
	getHello(res : Response): Response<any>
	{
		console.log('REQUEST');
		//return 'Hello World!';
		return (res.status(200).json('tes cringe frero'));
	}
}

