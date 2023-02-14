import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap()
{
  	const app = await NestFactory.create(AppModule);
  	await app.listen(3000);

	require('dotenv').config() //import dotenv
	console.log(process.env) //prinv local env
}
bootstrap();
