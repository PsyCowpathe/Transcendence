import { User } from '../../../db/user/user.entity'

export default class Player
{
	name: string;
	uid: number;
	user: User;
	score: number;

	constructor(user: User)
	{
		this.name = user.name;
		this.user = user;
		this.score = 0;
	}
}
