import { WebSocketServer, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import Game from './Game';

@WebSocketGateway()
export class PongGateway {//implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
	/*@WebSocketServer()
	server: Server;

	const games = new Map<number, Game>();
	const clients = new Map<string, Socket>(); // maps socket.id to client identifier
	const spectators = new Map<number, Socket>();

	handleConnection(socket: Socket)
	{
		const username: string = client.handshake.query.username;
		const spectator: boolean = client.handshake.query.spectator;
		console.log(`Client connected: $(username) identified as ${socket.id}`);
		if (clients.size() % 2 == 0)
		{
			const cli = Array.from(clients.keys());
			addGame(cli[cli.length - 2].name, username);
		}
		clients.set(username, socket);
	}

	handleDisconnect(socket: Socket)
	{
		console.log(`Client disconnected: $(clients[socket]) identified as ${socket.id}`);
		const cli = Array.from(clients.keys());
		const leaverIndex = cli.findIndex(entry => entry[1] === clients[socket]);
		if (leaverIndex % 2 == 0)
			server.to(cli[leaverIndex - 1]).emit('opponentLeft');
		else
			server.to(cli[leaverIndex + 1]).emit('opponentLeft');
		clients.delete(socket);
	}

	constructor() {
    		// update the game state every 30ms
    		setInterval(() =>
		{
			for (game in games)
			{
      				game.update();
				const gameState = game.getGameState();
				server.to(clients[game.p1.name]).emit('update', gameState);
				server.to(clients[game.p2.name]).emit('update', gameState);
      				if (game.GOAL)
				{
					if (ball.pos.x > 50)
					{
						server.to(clients[game.p1.name]).emit('GOAAAAAAL', 1);
						server.to(clients[game.p2.name]).emit('GOAAAAAAL', 1);
					}
					else
					{
						server.to(clients.[game.p1.name]).emit('GOAAAAAAL', 2);
						server.to(clients.[game.p2.name]).emit('GOAAAAAAL', 2);
					}
				}
			}
    		}, 30);
  	}

	function addGame(p1_name: string, p2_name: string)
	{
		games.set(new Game(new Player(p1_name), new Player(p2_name)));
		server.to(clients[p1_name]).emit('gameFound', games.size() - 1, p2_name, 1);
		server.to(clients[p2_name]).emit('gameFound', games.size() - 1, p1_name, 2);
	}

	@SubscribeMessage('movePaddle')
	onMovePaddle(id: number, game: number, position: number) {
    		// update the paddle position based on the client input
		if (id == 1)
    			games[game].p1_paddle.setPosition(position);
		else
    			games[game].p2_paddle.setPosition(position);
  	}*/

}
