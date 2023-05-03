import { IsPositive, IsNotEmpty, Length, IsString, IsNumber, IsDivisibleBy, IsAlphanumeric } from 'class-validator';

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
	@IsAlphanumeric(undefined, {message: 'Your username must be an alphanumeric string !'})
	@Length(3, 20, {message: 'Your username must contain between 3 and 20 caracters !'})
	name: string;
}

export class TwoFADto
{
	@IsDivisibleBy(1, {message: `The code must be an integer !`})
	@IsPositive({message: 'The code must be greater than 0 !'})
	@IsNotEmpty({message: 'The code can\'t be empty !'})
	code: number;
}

export class UserDto
{
	@IsString({message: `The username must be a string!`})
	@IsAlphanumeric(undefined, {message: 'The username must be an alphanumeric string !'})
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
	Status: string;
	Match: number;
	Victory: number;
	Defeat: number;
}
