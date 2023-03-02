import { NestFactory} from '@nestjs/core';

import { Req, Res} from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module';

import * as cookieParser from 'cookie-parser'

import * as fs from 'fs';

async function bootstrap()
{

	const httpsOptions =
	{
  		key: fs.readFileSync('./secret/cert.key'),
  		cert: fs.readFileSync('./secret/cert.crt'),
	};
  	const app = await NestFactory.create(AppModule, {httpsOptions,});
	app.use(cookieParser());

	app.enableCors
	({
		allowedHeaders: ['content-type', '*'],
		credentials : true,
		origin: ['http://localhost:3000'],
		methods: 'GET, POST',

		//preflightContinue: false,
		//optionsSuccessStatus: 204,
	});
  	await app.listen(3630);
}
bootstrap();

