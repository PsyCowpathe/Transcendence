"use strict"

import { Injectable } from '@nestjs/common';
//import { HttpService } from '@nestjs/axios';
//import { firstValueFrom } from 'rxjs';
//import { lastValueFrom} from 'rxjs';
//import { InjectRepository} from '@nestjs/typeorm';
//import { Repository} from 'typeorm';
//import { User } from './app.entity'
const axios = require('axios');


/*const {data} = await axios.post('/user', document.querySelector('#my-form'), {
  headers: {
    'Content-Type': 'application/json'
  }
})*/


/*@Injectable()
export class NewService
{
	constructor (
		private http: HttpService
	) {}
	async sendApiRequest()
	{
		let user =
			{
				grant_type: "client_credentials",
				client_id: process.env.UID,
				client_secret: process.env.SECRET
			}
		const url = "https://api.intra.42.fr/oauth/token";

			const response = await lastValueFrom(this.http.post(url, user));
			//.then(json =>
			{
				//console.log(json);
				//resolve(json.data.access_token);
			})
			.catch (error =>
			{
				//reject(error.toJSON().status);
			//}));
		console.log(response.data.access_token);
		return "baba";
	}
}*/

@Injectable()
export class NewService
{
	async sendApiRequest() : Promise<string>
	{
		let user =
		{
			grant_type: "client_credentials",
			client_id: process.env.UID,
			client_secret: process.env.SECRET
		}
		const url = "https://api.intra.42.fr/oauth/token";

		const response = await axios.post(url, user);
		.catch ((error : any) =>
		{
			return (error);
		});
		return (response.data.access_token);
	}

	async getUser(token : any) : Promise<string>
	{
		console.log(token);
		const url = "https://api.intra.42.fr/v2/cursus/42/users";
		const response = await axios.get(url, 
			{
				headers: { 'Authorization': 'Bearer ' + token }
			})
		.catch ((error : any) =>
		{
			console.log(error.message);
		});
		console.log(response);
		return (response);
	}
}


/*@Injectable()
export class UserService{
	constructor(
@InjectRepository(User)
private readonly userRepository: Repository<User>,
) {}

async findAll(): Promise<User[]> {
	return this.userRepository.find();
}

}*/

