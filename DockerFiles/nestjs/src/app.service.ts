import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

const axios = require('axios');

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
			const url = "https://api.intra.42.fr/oauth/token"
			const response = await axios.post(url, user)
			.catch(function (error) {
				if (error.response)
				{
					console.log("Request Success");
					console.log(error.response.data);
					console.log(error.response.status);
					console.log(error.response.headers);
				}
				else if (error.request)
				{
					console.log("No response");
					console.log(error.request);
				}
				else
				{
					console.log("Error");
					console.log('Error', error.message);
				}
			})
			console.log("SUCESS");
			return response.data.access_token;
		}
}

/*@Injectable()
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
			const url = "https://api.intra.42.fr/oauth/token"
		return new Promise((resolve, reject)
}*/
