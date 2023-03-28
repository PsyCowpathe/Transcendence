import { IsPositive, IsNotEmpty, Length, IsString, IsNumberString, IsDivisibleBy } from 'class-validator';

export class AuthDto
{
	@IsNotEmpty({message: 'The state can\'t be empty !'})
	state: string;
	
	@IsNotEmpty({message: 'The code can\'t be empty !'})
	code: string;
}

export class RegisterDto
{
	@IsString({message: `Your username must be a string !`})
	@Length(3, 20, {message: 'Your username must contain between 3 and 20 caracters !'})
	name: string;
}

export class Profile
{
	name: string;
	registered: boolean;
	newtoken: string | undefined;
	//status: boolean;
	//avatar; image;
}
