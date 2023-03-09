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

	async sendFriendRequest(sender: number, target: string) : Promise<number>
	{
		let askMan = await this.userService.findOneById(sender);
		let requestedUser = await this.userService.findOneByName(target);
		if (requestedUser === null || askMan === null)
			return (-1);
		let ret = await this.relationService.getRelationStatus(askMan, requestedUser);
		if (ret === "--++" || ret === "++--")
			return (-2);
		if (ret === "ally")
			return (-3);
		this.relationService.createRequest(askMan, requestedUser);
		let clientToNotify = this.sockets.get(requestedUser.id);
		if (clientToNotify !== undefined)
			clientToNotify.emit("sendfriendrequest", `${askMan.name} send you a friend request !`);
		return (1);
	}

	async acceptFriendRequest(sender: number, target: string) : Promise<number>
	{
		let yesMan = await this.userService.findOneById(sender);
		let askMan = await this.userService.findOneByName(target);
		if (askMan === null || yesMan === null)
			return (-1);
		let ret = await this.relationService.getRelationStatus(yesMan, askMan);
		if (ret === "++" || ret === "-+")
		{
			this.relationService.acceptRequest(yesMan, askMan);
			return (1);
		}
		let clientToNotify = this.sockets.get(askMan.id);
		if (clientToNotify !== undefined)
			clientToNotify.emit("acceptfriendrequest", `${yesMan.name} accepted your friend request !`);
		return (-2);
	}

	async refuseFriendRequest(sender: number, target: string) : Promise<number>
	{
		let noMan = await this.userService.findOneById(sender);
		let askMan = await this.userService.findOneByName(target);
		if (askMan === null || noMan === null)
			return (-1);
		let ret = await this.relationService.getRelationStatus(noMan, askMan);
		if (ret === "++"|| ret === "-+")
		{
			this.relationService.refuseRequest(noMan, askMan);
			return (1);
		}
		let clientToNotify = this.sockets.get(askMan.id);
		if (clientToNotify !== undefined)
			clientToNotify.emit("refusefriendrequest", `${noMan.name} refused your friend request !`);
		return (-2);
	}


	async deleteFriend(sender: number, target: string)
	{
		let deletor = await this.userService.findOneById(sender);
		let victim = await this.userService.findOneByName(target);
		if (victim === null || deletor === null)
			return (-1);
		let ret = await this.relationService.getRelationStatus(deletor, victim);
		if (ret === "ally")
		{
			this.relationService.deleteFriend(deletor, victim);
			return (1);
		}
		let clientToNotify = this.sockets.get(victim.id);
		if (clientToNotify !== undefined)
			clientToNotify.emit("deletefriend", `You are no longer friend with ${deletor.name} !`);
		return (-2);
	}

	async blockUser(sender: number, target: string)
	{
		let angryMan = await this.userService.findOneById(sender);
		let annoyingMan = await this.userService.findOneByName(target);
		if (annoyingMan === null || angryMan === null)
			return (-1);
		this.relationService.Ignore(angryMan, annoyingMan);
		let clientToNotify = this.sockets.get(annoyingMan.id);
		if (clientToNotify !== undefined)
			clientToNotify.emit("blockuser", `You can no longer interact with ${angryMan.name} !`);
		return (1);
	}

	async unBlockUser(sender: number, target: string)
	{
		let forgivingMan = await this.userService.findOneById(sender);
		let forgivedMan = await this.userService.findOneByName(target);
		if (forgivedMan === null || forgivingMan === null)
			return (-1);
		let ret = await this.relationService.getRelationStatus(forgivingMan, forgivedMan);
		if (ret !== "--++") 
			return (-2);
		this.relationService.unIgnore(forgivingMan, forgivedMan);
		let clientToNotify = this.sockets.get(forgivedMan.id);
		if (clientToNotify !== undefined)
			clientToNotify.emit("blockuser", `You can now interact with ${forgivingMan.name} !`);
		return (1);
	}

}
