import { Controller, Get, Post, Redirect, Param} from '@nestjs/common';

@Controller('cats')
export class CatsController
{
	@Post()
	create(): string
	{
		return 'This action create a cat';
	}

	@Get('promise')
	async promiseAll(): Promise<string[]>
	{
		return [];
	}

	@Get()
	findAll(): string
	{
		return 'This action returns all cats';
	}

	@Get(':id')
	findOne(@Param() params : any): string
	{
		console.log(params.id);
		return `test #${params.id}`;
	}

	@Get('promise')
	async getItem(): Promise<string[]>
	{
		return [];
	}

}

