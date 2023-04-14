import { IsDivisibleBy, IsPositive, IsNotEmpty, IsString, IsAlphanumeric, Length } from 'class-validator';

export class relationDto
{
	@IsDivisibleBy(1, {message: `The id must be an integer !`})
	@IsPositive({message: 'The id must be greater than 0 !'})
	@IsNotEmpty({message: 'The id cant\'t be empty !'})
	user: number;
}

export class requestDto
{

	@IsString({message: `The username must be a string !`})
	@IsAlphanumeric(undefined, {message: 'The username must be an alphanumeric string !'})
	@Length(3, 20, {message: 'The username must contain between 3 and 20 caracters !'})
	user: string;
}
