import { NestFactory } from '@nestjs/core';

import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

import * as cookieParser from 'cookie-parser'

import { urls } from './common/global'; 

import * as session from 'express-session';


async function bootstrap()
{
  	const app = await NestFactory.create(AppModule);

	app.use(cookieParser());

	app.use
	(
		session
		({
			secret: "secret",
			cookie:
			{
				httpOnly: true,
				secure: true
			}
		})
	)
	
	let ORIGIN;
	if (process.env.ORIGIN === undefined)
		ORIGIN = "http://localhost:3000";
	else
		ORIGIN = process.env.ORIGIN;
	app.enableCors
	({
		allowedHeaders: ['content-type', 'authorization', 'TwoFAToken'],
		credentials : true,
		origin:
		[
			ORIGIN, "http://10.13.7.3:3000", "http://10.13.3.3:3630", "http://10.13.3.3:3631",
			"http://10.13.3.3:3632", "http://10.13.3.3:3633", "http://10.13.3.3:3634"
		],
		methods: 'GET, POST',
	});
	app.useGlobalPipes(new ValidationPipe());

  	await app.listen(3630);
}
bootstrap();
