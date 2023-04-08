import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { UseFilters, UseGuards } from '@nestjs/common';
import { WsExceptionFilter } from '../guard/ws.filter'; 
import { Server, Socket } from 'socket.io';

import { WsStatusService }  from './wsstatus.service';
import { SocketGuard } from '../guard/socket.guard';

@UseFilters(WsExceptionFilter)
@WebSocketGateway(3633, {cors: true})
export class WsStatusGateway implements OnGatewayConnection, OnGatewayDisconnect
{
    constructor(private readonly wsStatusService: WsStatusService)
	{

	}

    @WebSocketServer()
	server: Server;

    @UseGuards(SocketGuard)
	@SubscribeMessage('newlink')
	createLink(client: Socket)
	{
		console.log("Newlink requested !");
		let clientToken = client.handshake.auth.token;
		this.wsStatusService.saveStatusSocket(client, clientToken);
	}

    handleConnection(client: Socket)
    {
        console.log("CONNECTED");
        this.wsStatusService.connection(client);
    }

    handleDisconnect(client: Socket)
    {
        console.log("DISCONNECTED");
        this.wsStatusService.deconnection(client);
    }

}