import { IsNotEmpty, IsString } from 'class-validator';

export class AuthDto
{
  state: string;
  code: string;
}

export class RegisterDto
{
	@IsNotEmpty()
	@IsString()
	name: string;
}

export class TokenDto
{
	token: string;
}

export class Profile
{
	name: string;
	registered: boolean;
	newtoken: string | undefined;
	//status: boolean;
	//avatar; image;
}
