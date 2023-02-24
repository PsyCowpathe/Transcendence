import { Controller, Get, Redirect, Header, Req, Post, Body} from '@nestjs/common';

import { AuthDto} from './auth.entity';

import { AuthService } from './auth.service';

let uid = "u-s4t2ud-21f144616dae6f0e27670562f16d1b3b8782bbad40c0d1ea5f0d1d54eae9d61f";
let redirect = encodeURIComponent("http://localhost:3000");
//let redirect = "https://reddit.com";
let random = "dwdadfegthyhgfdASYJTUNBFSDRGW48754454"

const URL: string = `https://api.intra.42.fr/oauth/authorize?client_id=${uid}&redirect_uri=${redirect}&response_type=code&scope=public&state=${random}'`

//const URL : string = "http://localhost:3000";
//


@Controller("auth")
export class AuthController
{
	constructor(private readonly authService: AuthService)
	{

	}

	@Get()
	//@Header('Access-Control-Allow-Origin', '*')
	//@Redirect(URL, 302)
	sayHello(@Req() request: Request)
	{
		//console.log(request);
		console.log('Hello');
		return (Request);
	}

	@Post('token')
	printtoken(@Body() token: AuthDto)
	{
		console.log('dataaaaaa');
		if (token.first_state === undefined || token.code === undefined
			|| token.second_state === undefined)
			console.log("Error code or state missing !")
		else if (token.second_state !== token.first_state)
			console.log("/!\ Error first state and second state are differents ! /!\\")
		else
		{
			const promise = this.authService.getUserToken(token);
			promise.then((json: any) =>
			{
				console.log(json);
			})
			.catch((error : any) =>
			{
				console.log(error);
			});
		}
	}

}
