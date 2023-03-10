import { Injectable } from '@nestjs/common';

import { Socket } from 'socket.io';

import { UserService } from '../../db/user/user.service';

@Injectable()
export class WsChatService
{
	constructor(private readonly userService : UserService)
	{

	}

	private sockets = new Map<number, Socket>;

	async saveChatSocket(client: Socket, token: string)
	{
		let user = await this.userService.findOneByToken(token);
		if (user !== null)
		{
			this.sockets.set(user.id, client);
			console.log("New socket saved : " + user.name);
		}
	}
}
