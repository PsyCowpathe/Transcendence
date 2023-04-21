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
import { mouseDto, numberDto, posDto } from './pong.entity'

@UseFilters(WsExceptionFilter)
@WebSocketGateway(3633, {cors: true})
export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
	@WebSocketServer()
	server: Server;

	clients = new Map<User, Socket>();
	queue = new Map<User, Socket>();
	games = new Array<Game>();

	constructor(private readonly userService: UserService)
	{
    		setInterval(() =>
		{
			for (const game of this.games)
			{
				const s1 = this.clients.get(game.p1.user);
				const s2 = this.clients.get(game.p2.user);
				if (s1 && s2)
				{
					const gameState = game.getGameState();
					s1.emit('update', gameState);
					s2.emit('update', gameState);
      					if (game.GOAL)
					{
						if (game.ball.pos.x > 50)
						{
							s1.emit('GOOOAAAAAAL', 1);
							s2.emit('GOOOAAAAAAL', 1);
						}
						else
						{
							s1.emit('GOOOAAAAAAL', 2);
							s2.emit('GOOOAAAAAAL', 2);
						}
						game.GOAL = false;
					}
				}
			}
    		}, 1);
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
		{
			this.clients.set(user, socket);
			console.log(`Client connected : ${user.name} identified as ${socket.id}`);
		}
		else
		{
			socket.emit("GameError", errorMessages.INVALIDUSER)
			console.log("no corresponding user in db");
		}
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
		const leaver = this.getUser(socket);
		if (leaver)
			console.log(`Client disconnected : ${leaver.name} identified as ${socket.id}`);
		this.leaveQueue(socket);
		this.leaveGame(socket);
	}

	@UseGuards(SocketGuard)
	@SubscribeMessage('joinQueue')
	joinQueue(socket: Socket, username: string)
	{
		let user: User | undefined;
		let cli: User[];

		user = this.getUser(socket);
		if (user)
		{
			this.queue.set(user, socket);
			console.log(`user ${username} identified as ${socket.id} joined the queue`);
			if (this.queue.size % 2 == 0)
			{
				cli = Array.from(this.queue.keys());
				this.addGame(cli[0], user);
				this.queue.delete(user);
				this.queue.delete(cli[0]);
			}
		}
		else
			socket.emit("GameError", errorMessages.INVALIDUSER)

	}

	@UseGuards(SocketGuard)
	@SubscribeMessage('joinGame')
	joinGame()
	{
		
	}

	@UseGuards(SocketGuard)
	@SubscribeMessage('leaveQueue')
	leaveQueue(socket: Socket)
	{
		let user: User | undefined;

		user = this.getUser(socket);
		if (user)
			this.queue.delete(user);
	}

	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('leaveGame')
	leaveGame(socket: Socket)
	{
		const leaver = this.getUser(socket);
		if (leaver)
		{
			let oppSock: Socket | undefined;
			for (const game of this.games)
			{
				if (game.p1.user.uid === leaver.uid)
					oppSock = this.clients.get(game.p2.user);
				else if (game.p2.user.uid === leaver.uid)
					oppSock = this.clients.get(game.p1.user);
				if (oppSock)
				{
					oppSock.emit('opponentLeft');
					this.games.splice(game.tag);
					break;
				}
			}
		}
	}

	addGame(p1: User, p2: User)
	{
		let s1 = this.clients.get(p1);
		let s2 = this.clients.get(p2);
		if (s1 && s2)
		{
			s1.emit('gameFound', this.games.length, p1.name, p2.name, 1);
			s2.emit('gameFound', this.games.length, p2.name, p1.name, 2);
			this.games.push(new Game(new Player(p1), new Player(p2), this.games.length));
		}
		console.log(`game launched : ${p1.name} was matched up with ${p2.name}`);
	}

	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('playerReady')
	playerReady(socket: Socket, gametag: numberDto)
	{
		const s1 = this.clients.get(this.games[gametag.input - 1].p1.user);
		const s2 = this.clients.get(this.games[gametag.input - 1].p2.user);
		let player_id: number = 0;
	
		const user = this.getUser(socket);
		if (user && this.games.length > gametag.input - 1)
		{
			if (user.uid === this.games[gametag.input - 1].p1.user.uid)
			{
				player_id = 1;
				this.games[gametag.input - 1].p1_ready = true;
			}
			else if (user.uid === this.games[gametag.input - 1].p2.user.uid)
			{
				player_id = 2;
				this.games[gametag.input - 1].p2_ready = true;
			}
			else
			{
				socket.emit('GameError', errorMessages.NOTAPLAYER);
				return;
			}
			if (s2 && player_id == 1)
				s2.emit("opponentReady");
			else if (s1)
				s1.emit("opponentReady");
			if (this.games[gametag.input - 1].p1_ready && this.games[gametag.input - 1].p2_ready)
			{
				console.log(`game [${gametag.input - 1}] is playing`);
				this.games[gametag.input - 1].update();
			}
		}

	}

	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('movePaddle')
	movePaddle(socket: Socket, data: posDto)
	{
		if (data.player_id == 1)
    			this.games[data.gametag - 1].p1_paddle.setPosition(data.position);
		else
    			this.games[data.gametag - 1].p2_paddle.setPosition(data.position);
  	}
}
