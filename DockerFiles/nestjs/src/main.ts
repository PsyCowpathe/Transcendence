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
		origin: [urls.ORIGIN, "http://localhost:3000", "http://localhost:3631", "http://localhost:3632", "http://localhost:3633", "http://localhost:3634"],
		methods: 'GET, POST',
	});
	app.useGlobalPipes(new ValidationPipe());

  	await app.listen(3630);
}
bootstrap();
