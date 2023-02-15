import { NestFactory } from '@nestjs/core';
import { NewModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(NewModule);
	await app.listen(3000);
	require('dotenv').config()
}
bootstrap();
