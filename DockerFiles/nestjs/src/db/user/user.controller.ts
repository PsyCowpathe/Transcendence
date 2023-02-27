import { Controller, Get, Post, Param, Body, Res} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('user')
export class UserController
{
	constructor(private readonly userService: UserService)
	{

	}

	@Get()
	print()
	{
		console.log('user');
	}

	@Post('create')
	createUser(@Body() user: User)
	{
		console.log('user');
		this.userService.create(user)
	}

	@Get(':id')
	getUser(@Param() params : any, @Res() res : Response)
	{
		const promise = this.userService.findOne(params.id);
		promise
		.then ((data) =>
		{
			console.log('success');
			console.log(data);
			return (res.status(200).json(data));
		})
		.catch ((error) =>
		{
			console.log('failure');
			console.log(error);
			return (error);
		});
	}
}
