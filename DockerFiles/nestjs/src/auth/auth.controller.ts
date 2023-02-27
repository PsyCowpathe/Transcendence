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
	async printtoken(@Body() tokenForm: AuthDto, @Res() res: Response)
	{
		console.log('Request received');

		console.log(tokenForm);
		if (tokenForm.first_state === undefined || tokenForm.code === undefined
			|| tokenForm.second_state === undefined)
		{
			console.log('ERROR 1');
			return (sendError(res, -42, errorMessages.MISSING));
		}
		else if (tokenForm.second_state !== tokenForm.first_state)
		{
			console.log('ERROR 2');
			return (sendError(res, -43, errorMessages.DIFFERENT));
		}
		else
		{
			try
			{
				const tokenInfo = await this.authService.getUserToken(tokenForm);
				console.log(tokenInfo);
				await new Promise(r => setTimeout(r, 1000));
				const userInfo = await this.authService.getMeInfo(tokenInfo.data.access_token);
				//await this.authService.createUser(token)
				return (sendSuccess(res, 10, tokenInfo.data));
			}
			catch (error)
			{
				console.log("ERREEEEEUUUUUR");
				console.log(error.message);
				return (sendError(res, -44, errorMessages.INVALIDARG));
			}
		}
	}
}
