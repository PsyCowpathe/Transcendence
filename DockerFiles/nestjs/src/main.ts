import { NestFactory } from '@nestjs/core';

import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

import * as cookieParser from 'cookie-parser'

import { urls } from './common/global'; 

async function bootstrap()
{
  	const app = await NestFactory.create(AppModule);

	app.use(cookieParser());

	let ORIGIN;
	if (process.env.URI === undefined)
		ORIGIN = "http://localhost:3000";
	else
		ORIGIN = process.env.URI;
	app.enableCors
	({
		allowedHeaders: ['content-type', 'authorization', 'TwoFAToken'],
		credentials : true,
		origin: [ORIGIN, "http://localhost:3000"],
		methods: 'GET, POST',
	});
	app.useGlobalPipes(new ValidationPipe());
  	await app.listen(3630);
}
bootstrap();
