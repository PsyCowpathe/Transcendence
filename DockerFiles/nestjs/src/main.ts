import { NestFactory } from '@nestjs/core';

import { Req, Res, ValidationPipe } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module';

import * as cookieParser from 'cookie-parser'

import * as fs from 'fs';

import { urls } from './common/global'; 

import * as session from 'express-session';

async function bootstrap()
{
	/*const httpsOptions =
	{
  		key: fs.readFileSync('./secret/cert.key'),
  		cert: fs.readFileSync('./secret/cert.crt'),
	};*/

  	const app = await NestFactory.create(AppModule);

	app.use(cookieParser());

	app.use(session({
		    secret: "secret",
		    cookie: {
		        httpOnly: true,
		        secure: true
		    }
		}))
	
	app.enableCors
	({
		allowedHeaders: ['content-type', 'authorization', 'TwoFAToken'],
		credentials : true,
		origin: [urls.ORIGIN, "http://10.13.8.3:3000"],
		methods: 'GET, POST',

		//preflightContinue: false,
		//optionsSuccessStatus: 204,

	});
	app.useGlobalPipes(new ValidationPipe());

  	await app.listen(3630);
}
bootstrap();
