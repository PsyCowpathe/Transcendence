import { IsPositive, IsNotEmpty, IsDivisibleBy, IsBoolean } from 'class-validator';

export class numberDto
{
	@IsDivisibleBy(1, {message: `The id must be a integer !`})
	@IsPositive({message: 'The id entered must be greater than 0'})
	@IsNotEmpty({message: 'The id can\'t be empty !'})
	input : number
}

export class mouseDto
{
	@IsPositive({message: 'The id entered must be greater than 0'})
	@IsNotEmpty({message: 'The id can\'t be empty !'})
	input : number
}

export class posDto
{
	@IsDivisibleBy(1, {message: `The id must be a integer !`})
	@IsPositive({message: 'The id entered must be greater than 0'})
	@IsNotEmpty({message: 'The id can\'t be empty !'})
	gametag: number;
	
	@IsPositive({message: 'The id entered must be greater than 0'})
	@IsNotEmpty({message: 'The id can\'t be empty !'})
	position: number;
};

export class answerDto
{
	@IsDivisibleBy(1, {message: `The id must be a integer !`})
	@IsPositive({message: 'The id entered must be greater than 0'})
	@IsNotEmpty({message: 'The id can\'t be empty !'})
	id1: number;
	
	@IsPositive({message: 'The id entered must be greater than 0'})
	@IsNotEmpty({message: 'The id can\'t be empty !'})
	@IsDivisibleBy(1, {message: `The id must be a integer !`})
	id2: number;

	@IsBoolean({message: "The answer must be a boolean !"})
	inviteAccepted: boolean;
};
