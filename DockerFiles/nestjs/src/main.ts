import { NestFactory } from '@nestjs/core';

import { Req, Res, ValidationPipe } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module';

import * as cookieParser from 'cookie-parser'

import * as fs from 'fs';

import { urls } from './common/global'; 

async function bootstrap()
{

	/*const httpsOptions =
	{
  		key: fs.readFileSync('./secret/cert.key'),
  		cert: fs.readFileSync('./secret/cert.crt'),
	};*/

  	const app = await NestFactory.create(AppModule);
	app.use(cookieParser());
	app.enableCors
	({
		allowedHeaders: ['content-type', 'authorization'],
		credentials : true,
		origin: [urls.ORIGIN, "http://10.13.4.3:3000"],
		methods: 'GET, POST',

		//preflightContinue: false,
		//optionsSuccessStatus: 204,
	});
	app.useGlobalPipes(new ValidationPipe());
  	await app.listen(3630);
}
bootstrap();
