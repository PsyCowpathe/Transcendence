import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { UseFilters, UseGuards } from '@nestjs/common';
import { WsExceptionFilter } from '../guard/ws.filter'; 
import { Server, Socket } from 'socket.io';

import { WsStatusService }  from './wsstatus.service';
import { SocketGuard } from '../guard/socket.guard';

@UseFilters(WsExceptionFilter)
@WebSocketGateway(3634, {cors: true})
export class WsStatusGateway implements OnGatewayConnection, OnGatewayDisconnect
{
    constructor(private readonly wsStatusService: WsStatusService)
	{

	}

	@WebSocketServer()
	server: Server;

    async handleConnection(client: Socket)
    {
        console.log("STATUS CONNECTED");
		let clientToken = client.handshake.auth.token;
        await this.wsStatusService.connection(client);
		await this.wsStatusService.saveStatusSocket(client, clientToken);
    }

    handleDisconnect(client: Socket)
    {
        console.log("STATUS DISCONNECTED");
        this.wsStatusService.deconnection(client);
    }

}
