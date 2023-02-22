import { Controller, Get, Redirect, Res, Post, Body} from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express'
import {CreateCatDto } from './create-cat.dto'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

	@Get('oui')
	getHello(@Res() res: Response): Response<any>
	{
		return this.appService.getHello(res);
	}

	@Post('send')
	getRequest(@Body() CatDto: CreateCatDto)
	{
		console.log(CatDto);
		console.log('name =' + CatDto.name);
		if (CatDto.name === undefined || CatDto.age === undefined)
			console.log('il me manque des infoooo');
		else
			console.log('Ho non encore lui');
		return ('OUIIIIII');
	}
}
