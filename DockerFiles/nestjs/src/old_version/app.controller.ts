"use strict"

import { Controller, Get } from '@nestjs/common';
import { NewService } from './app.service';

@Controller()
export class NewController
{
	constructor(private readonly newService: NewService) {}
	@Get('API')
	async sendApiRequest() : Promise<string>
	{
		const promise = await this.newService.sendApiRequest();
		console.log(promise)
		if (promise == '401')
			console.error('401');
		else
		{
			//console.log(promise);
			this.newService.getUser(promise);
		}
		return ('api');
	}
}
