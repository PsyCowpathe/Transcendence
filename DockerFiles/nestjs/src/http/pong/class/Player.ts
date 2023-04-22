import { User } from '../../../db/user/user.entity'

export default class Player
{
	name: string;
	user: User;
	sockid: string;
	score: number;

	constructor(user: User, sockid: string)
	{
		this.name = user.name;
		this.user = user;
		this.sockid = sockid;
		this.score = 0;
	}
}
