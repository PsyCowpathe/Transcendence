import { IsPositive, IsNotEmpty, Length, IsString, IsNumberString, IsDivisibleBy, IsAlphanumeric } from 'class-validator';

export class createChannelDto
{
	@IsString({message: `The channel name must be a string !`})
	@IsAlphanumeric(undefined, {message: 'The channel name must be an alphanumeric string !'})
	@Length(3, 20, {message: 'The channel name must contain between 3 and 20 caracters !'})
	channelname: string;

	@IsString({message: `The channel visibility must be a string !`})
	@IsAlphanumeric(undefined, {message: 'The channel visibility must be an alphanumeric string !'})
	@IsNotEmpty({message: 'The channel visibility can\'t be empty !'})
	visibility: string;

	password: string;
}

export class userOperationDto
{
	@IsString({message: `The user name must be a string !`})
	@IsAlphanumeric(undefined, {message: 'The user name must be an alphanumeric string !'})
	@Length(3, 20, {message: 'The user name must contain between 3 and 20 caracters !'})
	name: string;

	@IsString({message: `The channel name must be a string !`})
	@IsAlphanumeric(undefined, {message: 'The channel name must be an alphanumeric string !'})
	@Length(3, 20, {message: 'The channel name must contain between 3 and 20 caracters !'})
	channelname: string;
}

export class channelOperationDto
{
	@IsString({message: `The channel name must be a string !`})
	@IsAlphanumeric(undefined, {message: 'The channel name must be an alphanumeric string !'})
	@Length(3, 20, {message: 'The channel name must contain between 3 and 20 caracters !'})
	channelname: string;

	password: string;
}

export class sanctionOperationDto
{
	@IsString({message: `The user name must be a string !`})
	@IsAlphanumeric(undefined, {message: 'The user name must be an alphanumeric string !'})
	@Length(3, 20, {message: 'The user name must contain between 3 and 20 caracters !'})
	name: string;

	@IsString({message: `The channel name must be a string !`})
	@IsAlphanumeric(undefined, {message: 'The channel name must be an alphanumeric string !'})
	@Length(3, 20, {message: 'The channel name must contain between 3 and 20 caracters !'})
	channelname: string;

	@IsDivisibleBy(1, {message: `The time must be a integer !`})
	@IsPositive({message: 'The time entered must be greater than 0'})
	@IsNotEmpty({message: 'The time can\'t be empty !'})
	time: number;

	@IsString({message: `The reason must be a string !`})
	@IsAlphanumeric(undefined, {message: 'The reason must be an alphanumeric string !'})
	@Length(3, 60, {message: 'The reason must contain between 3 and 60 caracters !'})
	reason: string;
}

export class messageDto
{
	@IsString({message: `The destination must be a string !`})
	@IsAlphanumeric(undefined, {message: 'The destination must be an alphanumeric string !'})
	@Length(3, 20, {message: 'The destination  must contain between 3 and 20 caracters !'})
	destination: string;

	@IsString({message: `The message must be a string !`})
	@Length(1, 135, {message: 'The message must contain between 1 and 135 caracters !'})
	message: string
}
