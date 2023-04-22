import { IsPositive, IsNotEmpty, IsDivisibleBy } from 'class-validator';

export class numberDto
{
	@IsDivisibleBy(1, {message: `The id must be a integer !`})
	@IsPositive({message: 'The id entered must be greater than 0 cc'})
	@IsNotEmpty({message: 'The id can\'t be empty !'})
	input : number
}

export class mouseDto
{
	@IsPositive({message: 'The id entered must be greater than 0 ccuuuuuuuuuu'})
	@IsNotEmpty({message: 'The id can\'t be empty !'})
	input : number
}

export class posDto
{
/*	@IsDivisibleBy(1, {message: `The id must be a integer !`})
	@IsPositive({message: 'The id entered must be greater than 0 cc'})
	@IsNotEmpty({message: 'The id can\'t be empty !'})
	player_id: number;*/
	
	@IsDivisibleBy(1, {message: `The id must be a integer !`})
	@IsPositive({message: 'The id entered must be greater than 0 cc'})
	@IsNotEmpty({message: 'The id can\'t be empty !'})
	gametag: number;
	
	@IsPositive({message: 'The id entered must be greater than 0 ccuuuuuuuuuu'})
	@IsNotEmpty({message: 'The id can\'t be empty !'})
	position: number;
};
