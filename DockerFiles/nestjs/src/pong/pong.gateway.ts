import { WebSocketServer, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from './../db/user/user.entity'
import { UserService } from '../db/user/user.service'
import Game from './Game';
import Player from './Player'

@WebSocketGateway()
export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
	
	@WebSocketServer()
	server: Server;
	clients = new Map<User, Socket>();
	queue = new Map<User, Socket>();
	games = new Array<{ spectators: Array<Socket>, game: Game }>();

	constructor(private readonly userService: UserService)
	{
    		setInterval(() =>
		{
			for (const current of this.games)
			{
				const game = current.game;
				if (game.playing)
				{
					const s1 = this.clients.get(game.p1.user);
					const s2 = this.clients.get(game.p2.user);
					if (s1 && s2)
					{
      						game.update(Date.now());
						const gameState = game.getGameState();
						s1.emit('update', gameState);
						s2.emit('update', gameState);
						for (const spec of current.spectators)
							spec.emit('update', gameState);
      						if (game.GOAL)
						{
							if (game.ball.pos.x > 50)
							{
								s1.emit('GOAAAAAAL', 1);
								s2.emit('GOAAAAAAL', 1);
								for (const spec of current.spectators)
									spec.emit('GOAAAAAAL', 1);
							}
							else
							{
								s1.emit('GOAAAAAAL', 2);
								s2.emit('GOAAAAAAL', 2);
								for (const spec of current.spectators)
									spec.emit('GOAAAAAAL', 2);
							}
						}
					}
				}
			}
    		}, 30);
	}

	afterInit()
	{
		console.log("gateway initialized");
	}

	async handleConnection(socket: Socket)
	{
		let user: User | null = null;
		const token = socket.handshake.auth.token;
		if (token)
			user = await this.userService.findOneByToken(token); 
		if (user)
			this.clients.set(user, socket);
		else
			console.log("no corresponding user in db");
		console.log(`Client connected: $(username) identified as ${socket.id}`);
	}

	getClientUID(socket: Socket)
    	{
        	for (const [key, current] of this.clients.entries())
        	{
            		if (current === socket)
                  		return (key);
          	}
    	}

	handleDisconnect(socket: Socket)
	{
		console.log(`Client disconnected: $(clients[socket]) identified as ${socket.id}`);
		const leaver = this.getClientUID(socket);
		if (leaver)
		{
			for (const current of this.games)
			{
				let so: Socket | undefined;
				if (current.game.p1.user == leaver)
					so = this.clients.get(current.game.p2.user);
				else if (current.game.p2.user == leaver)
					so = this.clients.get(current.game.p1.user);
				if (so)
				{
					this.clients.delete(leaver);
					so.emit('opponentLeft');
					so.disconnect();
					for (const spec of current.spectators)
					{
						spec.emit("opponentLeft");
						spec.disconnect();
					}
					this.games.splice(current.game.tag);
					break;
				}
			}
		}
	}

	@SubscribeMessage('joinQueue')
	joinQueue(uid: number)
	{
		let user: User | undefined;
		let socket: Socket | undefined;
		let cli: User[];

		for (const usr of this.clients.keys())
		{
			if (usr.uid == uid)
			{
				user = usr;
				break;
			}
		}
		if (user && this.clients.size % 2 == 0)
		{
			cli = Array.from(this.clients.keys());
			this.addGame(cli[cli.length - 1], user);
			this.queue.delete(cli[cli.length - 1]);
		}
		else if (user)
		{
			socket = this.clients.get(user);
			if (socket)
				this.queue.set(user, socket);
		}
	}

	@SubscribeMessage('joinSpectators')
	joinSpectators(uid: number, gameToSpec: number)
	{
		const tag = gameToSpec;
		let socket: Socket | undefined;
		for (const usr of this.clients.keys())
		{
			if (usr.uid == uid)
			{
				socket = this.clients.get(usr)
				if (socket)
					this.games[tag].spectators.push(socket);
				break;
			}
		}
		if (socket)
			socket.emit('youreASpectatorPeasant', 3, this.games[tag].game.p1.name, this.games[tag].game.p2.name);
	}

	@SubscribeMessage('getGames')
	getGames()
	{
		return (this.games);
	}

	@SubscribeMessage('addGame')
	addGame(p1: User, p2: User)
	{
		let s1 = this.clients.get(p1);
		let s2 = this.clients.get(p2);
		if (s1 && s2)
		{
			s1.emit('gameFound', this.games.length, p1.name, p2.name, 1);
			s2.emit('gameFound', this.games.length, p2.name, p1.name, 2);
			this.games.push({
					spectators: new Array<Socket>(),
					game: new Game(new Player(p1), new Player(p2), this.games.length)
			});
			this.queue.delete(p1);
			this.queue.delete(p2);	
		}
	}

	@SubscribeMessage('playerReady')
	onPlayerReady(player_id: number, gametag: number)
	{
		const s1 = this.clients.get(this.games[gametag].game.p1.user);
		const s2 = this.clients.get(this.games[gametag].game.p2.user);
		if (s2 && player_id == 1)
			s2.emit("opponentReady");
		else if (s1)
			s1.emit("opponentReady");
		if (this.games[gametag].game.p1_ready && this.games[gametag].game.p1_ready)
		{
			setTimeout(function () {}, 2000);
			this.games[gametag].game.playing = true;
		}
	}

	@SubscribeMessage('movePaddle')
	onMovePaddle(player_id: number, gametag: number, position: number)
	{
		if (player_id == 1)
    			this.games[gametag].game.p1_paddle.setPosition(position);
		else
    			this.games[gametag].game.p2_paddle.setPosition(position);
  	}
}
