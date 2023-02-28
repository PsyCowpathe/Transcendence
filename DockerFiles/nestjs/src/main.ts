import { NestFactory } from '@nestjs/core';
import { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module';

import * as cookieParser from 'cookie-parser'

async function bootstrap()
{
  	const app = await NestFactory.create(AppModule);
	app.use(cookieParser());
	axios.defaults.withCredentials = true
	app.enableCors();
	({
		//allowedHeaders: ['content-type'],
		//origin: '*',
		//methods: 'GET, POST',
		//credentials : true,
		//preflightContinue: false,
		//optionsSuccessStatus: 204,
	});
  	await app.listen(3630);
}
bootstrap();
