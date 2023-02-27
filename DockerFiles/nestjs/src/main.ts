import { NestFactory } from '@nestjs/core';
import { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module';

async function bootstrap()
{
  	const app = await NestFactory.create(AppModule);
	app.enableCors();
	/*({
		//allowedHeaders: ['content-type'],
		origin: '*',
		methods: 'GET, POST',
		//credentials : true,
		//preflightContinue: false,
		//optionsSuccessStatus: 204,
	});*/
  	await app.listen(3630);
}
bootstrap();
