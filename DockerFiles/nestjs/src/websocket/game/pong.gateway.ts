import { WebSocketServer, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage } from '@nestjs/websockets';
import { UseFilters, UsePipes, UseGuards, ValidationPipe } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { User } from '../../db/user/user.entity'
import { UserService } from '../../db/user/user.service'
import Game from '../../http/pong/class/Game';
import Player from '../../http/pong/class/Player'
import { WsExceptionFilter } from '../guard/ws.filter';
import { SocketGuard } from '../guard/socket.guard';
import { errorMessages } from '../../common/global';
import { mouseDto, numberDto } from './pong.entity'

@UseFilters(WsExceptionFilter)
@WebSocketGateway()
export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
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
			{
			socket.emit("GameError", errorMessages.INVALIDUSER)
			console.log("no corresponding user in db");
			}
		console.log(`Client connected: $(username) identified as ${socket.id}`);
	}

	getUser(socket: Socket) : User | undefined
    	{
        	for (const [key, current] of this.clients.entries())
        	{
            		if (current === socket)
                  		return (key);
          	}
			return (undefined);
    	}

	handleDisconnect(socket: Socket)
	{
		console.log(`Client disconnected: $(clients[socket]) identified as ${socket.id}`);
		const leaver = this.getUser(socket);
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

	@UseGuards(SocketGuard)
	@SubscribeMessage('joinQueue')
	joinQueue(client: Socket)
	{
		let user: User | undefined;
		let cli: User[];

		user = this.getUser(client);
		if (user === undefined)
			client.emit("GameError", errorMessages.INVALIDUSER)
		if (user && this.clients.size % 2 == 0)
		{
			cli = Array.from(this.clients.keys());
			this.addGame(cli[cli.length - 1], user);
			this.queue.delete(cli[cli.length - 1]);
		}
		if (user)
			this.queue.set(user, client);
	}

	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('joinSpectators')
	joinSpectators(client: Socket, gameToSpec: numberDto)
	{
		const tag = gameToSpec.input;

		let user: User | undefined = this.getUser(client);
		if (user === undefined)
			client.emit("GameError", errorMessages.INVALIDUSER)
		else
			this.games[tag].spectators.push(client);
		client.emit('youreASpectatorPeasant', 3, this.games[tag].game.p1.name, this.games[tag].game.p2.name);
	}

	@UseGuards(SocketGuard)
	@SubscribeMessage('getGames')
	getGames()
	{
		return (Array.from(this.games.values()));
	}

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

	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('playerReady')
	onPlayerReady(client: Socket, gametag: numberDto)
	{
		const s1 = this.clients.get(this.games[gametag.input].game.p1.user);
		const s2 = this.clients.get(this.games[gametag.input].game.p2.user);
		let player_id: number = 0;
	
		const user = this.getUser(client);
		if (user)
		{
			if (user.uid == this.games[gametag.input].game.p1.user.uid)
				player_id = 1;
			else if (user.uid == this.games[gametag.input].game.p2.user.uid)
				player_id = 2;
			else
				client.emit('GameError', errorMessages.NOTAPLAYER);
		}

		if (s2 && player_id == 1)
			s2.emit("opponentReady");
		else if (s1)
			s1.emit("opponentReady");
		if (this.games[gametag.input].game.p1_ready && this.games[gametag.input].game.p1_ready)
		{
			setTimeout(function () {}, 2000);
			this.games[gametag.input].game.playing = true;
		}
	}

	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('movePaddle')
	onMovePaddle(player_id: numberDto, gametag: numberDto, position: mouseDto)
	{
		if (player_id.input == 1)
    			this.games[gametag.input].game.p1_paddle.setPosition(position.input);
		else
    			this.games[gametag.input].game.p2_paddle.setPosition(position.input);
  	}
}
