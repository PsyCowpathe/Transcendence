import { Injectable } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

import { UserService } from '../../db/user/user.service';
import { RelationService } from '../../db/relation/relation.service';

@Injectable()
export class WsStatusService
{
    constructor(private readonly userService : UserService,
                private readonly relationService : RelationService)
    {

    }

    private sockets = new Map<number, Socket>;

    async saveStatusSocket(client: Socket, token: string)
	{
		let user = await this.userService.findOneByToken(token);
		if (user !== null)
		{
			console.log(user.name);
			await this.sockets.set(user.id, client);
			console.log("New socket saved : " + user.name);
		}
	}

    isRegistered(socket: Socket)
	{
  		for (let [key, current] of this.sockets.entries())
		{
    		if (current === socket)
      			return key;
  		}
	}

    async connection(client: Socket)
    {
        let uid = await this.isRegistered(client);
        if (uid === undefined)
            return;
        let user = await this.userService.findOneByUid(uid);
        if (user === null)
            return;
        await this.userService.updateStatus("Online", user);
        let friendList : any = await this.relationService.getFriendUser(user);
        let i = 0;
        while (friendList[i])
        {
            let toNotify = await this.sockets.get(friendList[i].user2.id);
            if (toNotify)
                toNotify.join("friendconnected");
            i++
        }
        client.broadcast.emit("status", {name: user.name, status: "connected"});
    }

    async deconnection(client: Socket)
    {
        let uid = await this.isRegistered(client);
        if (uid === undefined)
            return;
        let user = await this.userService.findOneByUid(uid);
        if (user === null)
            return;
        await this.userService.updateStatus("Offline", user);
        let friendList : any = await this.relationService.getFriendUser(user);
        let i = 0;
        while (friendList[i])
        {
            let toNotify = await this.sockets.get(friendList[i].user2.id);
            if (toNotify)
                toNotify.join("frienddisconnected");
            i++
        }
        client.broadcast.emit("status", {name: user.name, status: "disconnected"});
    }
}
