import { IsPositive, IsNotEmpty, Length, IsString, IsNumber, IsDivisibleBy } from 'class-validator';

export class AuthDto
{
	@IsNotEmpty({message: 'The state can\'t be empty !'})
	state: string;
	
	@IsNotEmpty({message: 'The code can\'t be empty !'})
	code: string;
}

export class ChangeLoginDto
{
	@IsString({message: `Your username must be a string !`})
	@Length(3, 20, {message: 'Your username must contain between 3 and 20 caracters !'})
	name: string;
}

export class TwoFADto
{
	@IsDivisibleBy(1, {message: `The code must be a integer !`})
	@IsNotEmpty({message: 'The code can\'t be empty !'})
	code: number;
}

export class UserDto
{
	@IsString({message: `The username must be a string!`})
	@Length(3, 20, {message: 'Your username must contain between 3 and 20 caracters !'})
	name: string;
}


export class Profile
{
	name: string;
	registered: boolean;
	newtoken: string | undefined;
	newFA: string | undefined;
	TwoFA: boolean;
	//status: boolean;
	//avatar; image;
}


