import { Injectable } from '@nestjs/common';

import { Socket } from 'socket.io';

import { UserService } from '../../db/user/user.service';
import { RelationService } from '../../db/relation/relation.service';

@Injectable()
export class WsRelationService
{
	private sockets = new Map<number, Socket>;

	constructor(private readonly userService : UserService, private readonly relationService : RelationService)
	{

	}

	async saveRelationSocket(client: Socket, token: string)
	{
		let user = await this.userService.findOneByToken(token);
		if (user !== null)
		{
			this.sockets.set(user.id, client);
			console.log("New socket saved : " + user.id + " with " + client);
		}
	}

	isRegistered(socket: Socket)
	{
  		for (let [key, current] of this.sockets.entries())
		{
			console.log(key);
    		if (current === socket)
      			return key;
  		}
	}

	async sendFriendRequest(sender: number, receiver: string) : Promise<number>
	{
		let askMan = await this.userService.findOneById(sender);
		let requestedUser = await this.userService.findOneByName(receiver);
		if (requestedUser === null || askMan === null)
			return (-1);
		let ret = await this.relationService.getRelationStatus(askMan, requestedUser);
		if (ret === "enemy")
			return (-2);
		if (ret === "ally")
			return (-3);
		this.relationService.createRequest(askMan, requestedUser);
		return (1);
	}

	async acceptFriendRequest(sender: number, receiver: string) : Promise<number>
	{
		let yesMan = await this.userService.findOneById(sender);
		let askMan = await this.userService.findOneByName(receiver);
		if (askMan === null || yesMan === null)
			return (-1);
		let ret = await this.relationService.getRelationStatus(yesMan, askMan);
		console.log("status = " + ret);
		if (ret === "++" || ret === "-+")
		{
			this.relationService.acceptRequest(yesMan, askMan);
			return (1);
		}
		return (-2);
	}
}

//aurel :  [ Relation { id: 1, type: 1 }, Relation { id: 2, type: 0 } ]
//charle : [ Relation { id: 1, type: 1 }, Relation { id: 2, type: 0 } ]

