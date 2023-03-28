import { IsPositive, IsNotEmpty, Length, IsString, IsNumberString, IsDivisibleBy } from 'class-validator';

export class createChannelDto
{
	@IsString({message: `The channel name must be a string !`})
	@Length(3, 20, {message: 'The channel name must contain between 3 and 20 caracters !'})
	channelname: string;

	@IsString({message: `The channel visibility must be a string !`})
	@IsNotEmpty({message: 'The channel visibility can\'t be empty !'})
	visibility: string;

	password: string;
}

export class userOperationDto
{
	@IsString({message: `The user name must be a string !`})
	@Length(3, 20, {message: 'The user name must contain between 3 and 20 caracters !'})
	name: string;

	@IsString({message: `The channel name must be a string !`})
	@Length(3, 20, {message: 'The channel name must contain between 3 and 20 caracters !'})
	channelname: string;
}

export class channelOperationDto
{
	@IsString({message: `The channel name must be a string !`})
	@Length(3, 20, {message: 'The channel name must contain between 3 and 20 caracters !'})
	channelname: string;

	@IsString({message: `The password name must be a string !`})
	password: string;
}

export class sanctionOperationDto
{
	@IsString({message: `The user name must be a string !`})
	@Length(3, 20, {message: 'The user name must contain between 3 and 20 caracters !'})
	name: string;

	@IsString({message: `The channel name must be a string !`})
	@Length(3, 20, {message: 'The channel name must contain between 3 and 20 caracters !'})
	channelname: string;

	@IsDivisibleBy(1, {message: `The time must be a integer !`})
	@IsPositive({message: 'The time entered must be greater than 0'})
	@IsNotEmpty({message: 'The time can\'t be empty !'})
	time: number;

	@IsString({message: `The reason must be a string !`})
	@Length(3, 60, {message: 'The reason must contain between 3 and 60 caracters !'})
	reason: string;
}
