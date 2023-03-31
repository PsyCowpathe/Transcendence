import { WebSocketServer, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PongGame } from './pong-game';

@WebSocketGateway()
export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
	@WebSocketServer()
	server: Server;

	const game = new Map<number, Game>();
	const clients = new Map<string, string>(); // maps socket.id to client identifier
  
	io.on("connection", (socket) => {
		console.log(`Client connected: ${socket.id}`);

  		// receive client identifier from client
		socket.on("setClientId", (clientId: string) => {
			console.log(`Client ${clientId} identified as ${socket.id}`);
			clients.set(socket.id, clientId);
		});

  		socket.on("disconnect", () => {
  			console.log(`Client disconnected: ${socket.id}`);
  	  		clients.delete(socket.id);
  		});
  	});

	constructor() {
    		// update the game state every 30ms
    		setInterval(() => {
      			this.game.update();
			this.server.emit('update', this.game.getGameState());
      			if (this.game.GOAL)
			{
				if (ball.pos.x > 50)
					this.server.emit('GOAAAAAAL', 1);
				else
					this.server.emit('GOAAAAAAL', 2);
			}
    		}, 30);
  	}

	@SubscribeMessage('movePaddle')
	onMovePaddle(client, position) {
    		// update the paddle position based on the client input
    		this.game.p1_paddle.setPosition(client.id, position);
  	}
}
