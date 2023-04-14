import { IsNotEmpty, Length, IsString, IsNumberString, IsAlphanumeric, NotContains } from 'class-validator';


export class numberParameterDto
{
	@IsNumberString(undefined, {message : 'The id must be a number !'})
	@NotContains("-+,.", {message : 'The id must an integer greater than 0 !'})
	@IsNotEmpty({message: 'The id can\'t be empty !'})
	id: number;
}

export class stringParameterDto
{
	@IsString({message: `The channel name must be a string !`})
	@IsAlphanumeric(undefined, {message: 'The channel name must be an alphanumeric string !'})
	@Length(3, 20, {message: 'The channel name must contain between 3 and 20 caracters !'})
	channelName: string;
}
