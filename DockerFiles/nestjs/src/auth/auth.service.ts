import { Injectable } from '@nestjs/common';

import { AuthDto} from './auth.entity';

import { urls } from '../common/global';

import { UserService } from '../db/user/user.service';
import { User } from '../db/user/user.entity';

import { Profile } from './auth.entity';

import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
const axios = require('axios');

@Injectable()
export class AuthService
{
	constructor(private readonly userService : UserService)
	{

	}

	async getUserToken(token : AuthDto)
	{
		console.log("state = ");
		console.log(token.state);
		console.log("code = ");
		console.log(token.code);
		let user =
		{
			grant_type: 'authorization_code',
			client_id: process.env.UID, 
			client_secret: process.env.SECRET,
			code: token.code,
			redirect_uri : urls.URI,
			state: token.state,
		}
		const response = await axios.post(urls.TOKEN, user)
		.catch ((error: any) =>
		{
			console.log("Erreur 5");
			console.log(error);
			return (error);
		});
		if (response.data === undefined)
			return (undefined)
		return (response.data.access_token);
	}

	async createUser(originalToken: string, hashedToken: string) : Promise<Profile>
	{
		let data: Profile;

		const Header =
		{
			headers:
			{
				authorization: `Bearer ${originalToken}`,
			}
		}
		const response = await axios.get(urls.ME, Header)
		.catch((error: any) =>
		{
			console.log("Erreur 4");
			return (error);
		});
		let user = await this.getUserInfos(undefined, response.data.id);
		if (user === null)
		{
			let newUser : User = new User(); 
			newUser.token = hashedToken;
			newUser.name = response.data.login;
			newUser.uid = response.data.id;
			newUser.registered = false;
			newUser.TwoFASecret = "";
			newUser.TwoFA = false;
			this.userService.create(newUser);
			data = this.createProfile(false, newUser, hashedToken);
			console.log('User successfully added to the database !');
		}
		else 
		{
			await this.userService.updateToken(hashedToken, user);
			data = this.createProfile(true, user, hashedToken);
			console.log('User already exist, updating token in db !');
		}
		return (data);
	}


	createProfile(registered: boolean, userInfos: any, hashedToken?: string) : Profile
	{
		let data: Profile;
		data =
		{
			name : userInfos.name,
			registered : registered,
			newtoken : hashedToken,
		};
		return (data);
	}

	async defineName(name: string, token: string | undefined) : Promise<number>
	{
		let ret = await this.userService.findOneByName(name);
		if (ret !== null)
			return (-1);
		let user = await this.userService.findOneByToken(token);
		if (user !== null)
		{
			await this.userService.updateName(name, user);
			if (user.registered === false)
				await this.userService.updateRegister(true, user);
		}
		return (1);
	}

	async getUserInfos(name?: string, uid?: number) : Promise<User | null>
	{
		if (name !== undefined)
			return (this.userService.findOneByName(name));
		else if (uid !== undefined)
			return (this.userService.findOneByUid(uid));
		return (null);
	}

	async hashMyToken(originalToken: string) : Promise<string>
	{
		const salt = await bcrypt.genSalt();
		const hashedToken = await bcrypt.hash(originalToken, salt);
		return (hashedToken);
	}

	async isTokenValid(token: string | undefined): Promise<boolean>
	{
		if (token === undefined)
			return (false);
		const user = await this.userService.findOneByToken(token);
		if (user === null)
			return (false);
		return (true);
	}

	async changeAvatar(token: string | undefined, file: Express.Multer.File) : Promise<number>
	{
		if (file.mimetype === 'image/png')
		{
			if (file.buffer[0] !== 0x89 || file.buffer[1] !== 0x50 || file.buffer[2] !== 0x4e
				|| file.buffer[3] !== 0x47 || file.buffer[4] !== 0x0d || file.buffer[5] !== 0x0a
				|| file.buffer[6] !== 0x1a || file.buffer[7] !== 0x0a)
			return (-1);
		}
		else
		{
			if (file.buffer[0] !== 0xff || file.buffer[1] !== 0xd8 || file.buffer[2] !== 0xff)
			return (-1);
		}
		if (file.size > 1000000)
			return (-1);
		const user = await this.userService.findOneByToken(token);
		if (user === null)
			return (-2);
		fs.writeFile("avatars/" + user.uid, file.buffer,
			(err) =>
			{
        		if (err)
					return (-2);
      		});
		console.log("avatar changer avec success");
		return (1);
	}

	async generate2FA(token: string | undefined) : Promise<number | string>
	{
		const user = await this.userService.findOneByToken(token);
		if (user === null)
			return (-1);
		if (user.TwoFA === true)
			return (-2);
		await this.userService.updateTwoFA(true, user);
		const secret = authenticator.generateSecret();
		const otpauthUrl = authenticator.keyuri(user.name, 'Transcendence', secret);
		await this.userService.updateTwoFASecret(secret, user);
		let qrCode = toDataURL(otpauthUrl);
		return (qrCode);
	}
}
