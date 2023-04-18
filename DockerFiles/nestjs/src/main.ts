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
	
	app.enableCors
	({
		allowedHeaders: ['content-type', 'authorization', 'TwoFAToken'],
		credentials : true,
		origin: [urls.ORIGIN, "http://10.12.2.6:3000"],
		methods: 'GET, POST',
	});
	app.useGlobalPipes(new ValidationPipe());

  	await app.listen(3630);
}
bootstrap();
