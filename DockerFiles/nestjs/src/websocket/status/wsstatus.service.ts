import { Injectable } from '@nestjs/common';

import { Socket, Server } from 'socket.io';

import { UserService } from '../../db/user/user.service';
import { RelationService } from '../../db/relation/relation.service';

import { User } from '../../db/user/user.entity'


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
			await this.sockets.set(user.id, client);
	}

    isRegistered(socket: Socket)
	{
  		for (let [key, current] of this.sockets.entries())
		{
    		if (current === socket)
      			return key;
  		}
	}

    async changeStatus(user: User, status: string)
    {
        let socket = await this.sockets.get(user.id);
        await this.userService.updateStatus(status, user);
		if (socket)
        	socket.broadcast.emit("status", {id: user.id, status: status});
    }

    async connection(client: Socket)
    {
        let uid = await this.isRegistered(client);
        if (uid === undefined)
            return;
        let user = await this.userService.findOneById(uid);
        if (user === null)
            return;
        await this.userService.updateStatus("Online", user);
        client.broadcast.emit("status", {id: user.id, status: "Online"});
    }

    async deconnection(client: Socket)
    {
        let uid = await this.isRegistered(client);
        if (uid === undefined)
            return;
        let user = await this.userService.findOneById(uid);
        if (user === null)
            return;
        await this.userService.updateStatus("Offline", user);
        client.broadcast.emit("status", {id: user.id, status: "Offline"});
    }
}
