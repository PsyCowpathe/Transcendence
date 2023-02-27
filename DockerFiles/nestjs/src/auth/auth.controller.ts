import { Controller, Get, Redirect, Header, Req, Post, Body, Res} from '@nestjs/common';
import { Response } from 'express'; 

import { AuthDto} from './auth.entity';
import { AuthService } from './auth.service';

import { sendError, sendSuccess } from '../common/response';
import { errorMessages } from '../common/global'; 



@Controller("auth")
export class AuthController
{
	constructor(private readonly authService: AuthService)
	{

	}

	@Post('register')
	async printtoken(@Body() token: AuthDto, @Res() res: Response)
	{
		console.log('dataaaaaa');

		console.log(token);
		if (token.first_state === undefined || token.code === undefined
			|| token.second_state === undefined)
		{
			console.log('ERROR 1');
			return (sendError(res, -42, errorMessages.MISSING));
		}
		else if (token.second_state !== token.first_state)
		{
			console.log('ERROR 2');
			return (sendError(res, -43, errorMessages.DIFFERENT));
		}
		else
		{
			try
			{
				const promise = await this.authService.getUserToken(token);
				console.log(promise);
				return (sendSuccess(res, 10, promise.data));
			}
			catch (error)
			{
				console.log(error);
				return (sendError(res, -44, errorMessages.INVALIDARG));
			}
		}
	}
}
