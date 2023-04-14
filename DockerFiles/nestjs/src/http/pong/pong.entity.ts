import { IsDivisibleBy, IsPositive, IsNotEmpty } from 'class-validator';

export class gameIdDto
{
	@IsDivisibleBy(1, {message: 'The id must be an integer !'})
	@IsPositive({message: 'The id must be greater than 0 !'})
	@IsNotEmpty({message: 'The id can\'t be empty !'})
	id: number
}
