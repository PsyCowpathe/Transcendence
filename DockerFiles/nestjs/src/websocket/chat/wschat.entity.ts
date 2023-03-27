import { IsPositive } from 'class-validator';

export class createChannelDto
{
	name: string;

	visibility: string;

	password: string | undefined;
}

export class userOperationDto
{
	name: string;

	channelname: string;
}

export class channelOperationDto
{
	name: string;

	channelname: string;

	password: string;
}

export class sanctionOperationDto
{
	name: string;

	channelname: string;

	@IsPositive({message: 'The number entered must be greater than 0'})
	time: number;

	reason: string;
}
