import { Controller, Get } from '@nestjs/common';
import { NewService } from './app.service';

@Controller()
export class NewController
{
	constructor(private readonly newService: NewService) {}
	@Get('API')
	sendApiRequest() : string
	{
		const res = this.newService.sendApiRequest();
		console.log(res);
		return 'ok';
	}
}
