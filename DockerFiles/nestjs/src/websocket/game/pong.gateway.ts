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
	games = new Map<number, Game>();
	duelists = new Map<{uid1: number, uid2: number}, {here1: boolean, here2: boolean}>();
	duelInvites = new Map<number, number>();

	constructor(private readonly userService: UserService)
	{
	       this.update();
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

	async handleDisconnect(socket: Socket)
	{
		const leaver = this.getUser(socket);
		if (leaver)
		{
			await this.userService.updateStatus("Online", leaver);
			socket.emit("status", "Online");
			console.log(`Client disconnected : ${leaver.name} identified as ${socket.id}`);
		}
		this.leaveQueue(socket);
		this.leaveGame(socket);
	}

	async addGame(p1: User, p2: User)
	{
		let s1 = this.clients.get(p1);
		let s2 = this.clients.get(p2);
		if (s1 && s2)
		{
			await this.userService.updateStatus("InGame", p1);
			await this.userService.updateStatus("InGame", p2);
			s1.emit("status", "InGame");
			s2.emit("status", "InGame");
			s1.emit('gameFound', this.games.size, p1.name, p2.name, 1);
			s2.emit('gameFound', this.games.size, p2.name, p1.name, 2);
			this.games.set(this.games.size, new Game(new Player(p1, s1.id), new Player(p2, s2.id), this.games.size));
		}
		console.log(`game launched : ${p1.name} was matched up with ${p2.name}`);
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
			for (const game of this.games.values())
			{
				if (game.p1.user.uid == user.uid)
				{
					socket.emit("GameError", "already in game"); // A CHANGER
					break;
				}
			}

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
			socket.emit("GameError", errorMessages.INVALIDUSER);
	}

	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('sendDuel')
	async sendDuelInvite(socket: Socket, opp_uid: numberDto)
	{
		let user: User | undefined;
		let opp: User | null = await this.userService.findOneByUid(opp_uid.input);

		user = this.getUser(socket);
		if (user && opp)
		{
			for (const [inviting, invited] of this.duelInvites.entries())
			{
				if (inviting === user.uid)
				{
					socket.emit("GameError", "already a duel invite pending"); // A CHANGER
					return;
				}
				if (inviting === opp.uid && invited === user.uid)
				{
					socket.emit("GameError", "you were already invited by this player"); // A CHANGER
					return;
				}
			}
			for (const usr of this.queue.keys())
			{
				if (usr.uid === user.uid || usr.uid === opp.uid)
				{
					socket.emit("GameError", "already in queue"); // A CHANGER
					return;
				}
			}
			for (const game of this.games.values())
			{
				if (game.p1.user.uid === user.uid || game.p1.user.uid === opp.uid)
				{
					socket.emit("GameError", "already in game"); // A CHANGER
					return;
				}
			}
			for (const duel of this.duelists.keys())
			{
				if (duel.uid1 === user.uid)
				{
					socket.emit("GameError", "already in a duel"); // A CHANGER
					return;
				}
			}
		
			const opp_sock = this.clients.get(opp);
			if (opp_sock)
			{
				this.duelInvites.set(user.uid, opp_uid.input);
				opp_sock.emit('duelInviteReceived');
			}
		}
		else
			socket.emit("GameError", errorMessages.INVALIDUSER);
	}

	@UseGuards(SocketGuard)
	@SubscribeMessage('getInvites')
	async getInvites(socket: Socket)
	{
		let player = this.getUser(socket);
		let invitesList = new Map<string, number>();
		
		if (player && invitesList)
		{
			for (const [inviting, invited] of this.duelInvites.entries())
			{
				if (invited === player.uid)
					invitesList.set("name", inviting);
			}
		}
	}

	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('answerDuel')
	async answerDuelInvite(s1: Socket, uid1: numberDto, uid2: numberDto, inviteAccepted: boolean)
	{
		let player1: User | null = await this.userService.findOneByUid(uid1.input); 
		let player2: User | null = await this.userService.findOneByUid(uid2.input); 
		let s2!: Socket | undefined;
		let wasInvited: boolean = false;
		
		if (player1 && player2)
		{
			for (const game of this.games.values())
			{
				if (this.queue.get(player1) != undefined ||
					this.queue.get(player2) != undefined ||
					game.p1.user.uid == player1.uid ||
					game.p2.user.uid == player1.uid ||
					game.p1.user.uid == player2.uid ||
					game.p2.user.uid == player2.uid)
				{
					s1.emit("GameError", "already in game"); // A CHANGER
					return;
				}
			}
			for (const usr of this.queue.keys())
			{
				if (usr.uid === player1.uid || usr.uid === player2.uid)
				{
					s1.emit("GameError", "already in queue"); // A CHANGER
					return;
				}
			}
			for (const duel of this.duelists.keys())
			{
				if (duel.uid1 === player1.uid || duel.uid2 === player1.uid ||
				   	duel.uid1 === player2.uid || duel.uid2 === player2.uid)
				{
					s1.emit("GameError", "already in a duel"); // A CHANGER
					return;
				}
			}
			for (const [inviting, invited] of this.duelInvites.entries())
			{
				if (inviting === uid2.input && invited === uid1.input)
				{
					wasInvited = true;
					break;
				}
			}
			if (!wasInvited)
			{
				s1.emit("GameError", "not invited"); // A CHANGER
				return;
			}
			
			s2 = this.clients.get(player2);
			if (s2)
					s2.emit('duelInviteAnswered', player1.name, inviteAccepted);
			else
				s1.emit('GameError', "opponent unavailable"); // A CHANGER
			if (inviteAccepted === true)
			{
				this.addGame(player1, player2);	
				this.duelists.set({uid1: player1.uid, uid2: player2.uid}, {here1: false, here2: false});
			}
			else
				s1.emit('duelInviteReceived'); // to cause a refresh of the list on the client side
			this.duelInvites.delete(uid1.input);
		}
		else
			s1.emit('GameError', errorMessages.INVALIDUSER);
	}

	@UseGuards(SocketGuard)
	@SubscribeMessage('accessDuel')
	accessDuel(socket: Socket)
	{
		let player: User | undefined = this.getUser(socket); 

		if (player)
		{
			for (const [players, status] of this.duelists.entries())
			{
				if (players.uid1 == player.uid)
				{
					for (const game of this.games.values())
					{
						if (game.p1.user.uid === player.uid)
						{
							game.p1.sockid = socket.id;
							socket.emit('gameFound', game.tag, game.p1.name, game.p2.name, 1);
							break;
						}
					}
					if (!status.here2)
						this.duelists.set(players, {here1: true, here2: false});
					else
						this.duelists.delete(players);
				}
				else if (players.uid2 == player.uid)
				{
					for (const game of this.games.values())
					{
						if (game.p2.user.uid === player.uid)
						{
							game.p2.sockid = socket.id;
							socket.emit('gameFound', game.tag, game.p1.name, game.p2.name, 2);
							break;
						}
					}
					if (!status.here1)
						this.duelists.set(players, {here1: false, here2: true});
					else
						this.duelists.delete(players);
				}
			}
		}
		else
			socket.emit('GameError', "no duel pending");
	}

	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('useSpell')
	useSpell(socket: Socket, tag: numberDto)
	{
		const game = this.games.get(tag.input - 1);

		if (game && game.variant && game.p1.sockid == socket.id)
			game.useSpell(1);
		else if (game && game.variant && game.p2.sockid == socket.id)
			game.useSpell(2);
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
	async leaveGame(socket: Socket)
	{
		let opp: User | undefined;
		const leaver = this.getUser(socket);
		if (leaver)
		{
			let oppSock: Socket | undefined;
			for (const game of this.games.values())
			{
				if (game.p1.user.uid === leaver.uid)
					oppSock = this.clients.get(game.p2.user);
				else if (game.p2.user.uid === leaver.uid)
				{
					oppSock = this.clients.get(game.p1.user);
				}
				if (oppSock)
				{
					oppSock.emit("status", "Online");
					opp = this.getUser(oppSock);
					if (opp)
						await this.userService.updateStatus("Online", opp);
					socket.emit("status", "Online");
					await this.userService.updateStatus("Online", leaver);
					oppSock.emit('opponentLeft');
					this.games.delete(game.tag);
					break;
				}
			}
		}
	}

	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('activateVariant')
	activateVariant(socket: Socket, tag: numberDto)
	{
		const game = this.games.get(tag.input - 1);
		let s1!: Socket | undefined;
		let s2!: Socket | undefined;
		
		if (game)
		{
			s1 = this.clients.get(game.p1.user);
			s2 = this.clients.get(game.p2.user);
			if (game.p1.sockid == socket.id)
			{
    				game.p1_variant = true;
				if (game.p2_variant == false)
				{
					if (s2)
						s2.emit('variantProposed');
				}
			}
			else if	(game.p2.sockid == socket.id)
			{
    				game.p2_variant = true;
				if (game.p1_variant == false)
				{
					if (s1)
						s1.emit('variantProposed');
				}
			}
			if (game.p1_variant && game.p2_variant)
			{
				game.variant = true;
				if (s1 && s2)
				{
					s1.emit('variantOnOff', true);
					s2.emit('variantOnOff', true);
				}
			}
		}	
	}

	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('rejectVariant')
	rejectVariant(socket: Socket, tag: numberDto)
	{
		const game = this.games.get(tag.input - 1);
		let s1!: Socket | undefined;
		let s2!: Socket | undefined;
		
		if (game)
		{
			s1 = this.clients.get(game.p1.user);
			s2 = this.clients.get(game.p2.user);
			if (game.p1.sockid == socket.id)
			{
    				game.p1_variant = true;
				if (s2)
					s2.emit('variantOff', false);
			}
			else if	(game.p2.sockid == socket.id)
			{
    				game.p2_variant = true;
				if (s1 && s2)
				{
					s1.emit('variantOnOff', false);
					s2.emit('variantOnOff', false);
				}
			}
		}	
	}

	@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('playerReady')
	async playerReady(socket: Socket, gametag: numberDto)
	{
		let s1: Socket | undefined;
		let s2: Socket | undefined;
		const game = this.games.get(gametag.input - 1);

		if (game)
		{
			s1 = this.clients.get(game.p1.user);
			s2 = this.clients.get(game.p2.user);
		}
	
		let player_id: number = 0;	
		const user = this.getUser(socket);
		if (user && game)
		{
			if (user.uid === game.p1.user.uid)
			{
				player_id = 1;
				game.p1_ready = true;
			}
			else if (user.uid === game.p2.user.uid)
			{
				player_id = 2;
				game.p2_ready = true;
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
			if (game.p1_ready && game.p2_ready)
			{
				console.log(`game [${game.tag}] is playing`);
				game.start();
				if (s1 && s2)
				{
					s1.emit('playing');
					s2.emit('playing');
				}
			}
		}
	}

	//@UseGuards(SocketGuard)
	@UsePipes(new ValidationPipe())
	@SubscribeMessage('movePaddle')
	movePaddle(socket: Socket, data: posDto)
	{
		const game = this.games.get(data.gametag - 1);
		if (game)
		{
			if (game.p1.sockid == socket.id)
    				game.p1_paddle.setPosition(data.position);
			else if	(game.p2.sockid == socket.id)
    				game.p2_paddle.setPosition(data.position);
		}
  	}

	update = () =>
	{
		for (const game of this.games.values())
		{
			const s1 = this.clients.get(game.p1.user);
			const s2 = this.clients.get(game.p2.user);
			if (s1 && s2)
			{
				const gameState = game.getGameState();
				s1.emit('update', gameState);
				s2.emit('update', gameState);
				if (game.timeover)
				{
					s1.emit("status", "Online");
					s2.emit("status", "Online");
					if (game.p1.score > game.p2.score)
					{
						s1.emit('victory', true)
						s2.emit('defeat', true);
					}
					else if (game.p2.score > game.p1.score)
					{
						s2.emit('victory', true)
						s1.emit('defeat', true);
					}
					else
					{
						s1.emit('draw');
						s2.emit('draw');
					}
					this.games.delete(game.tag);
				}
				else
				{
					if (game.p1.score == 11)
					{
						s1.emit("status", "Online");
						s2.emit("status", "Online");
						s1.emit('victory');
						s2.emit('defeat');
						this.games.delete(game.tag);
					}
					else if (game.p2.score == 11)
					{
						s1.emit("status", "Online");
						s2.emit("status", "Online");
						s1.emit('defeat');
						s2.emit('victory');
						this.games.delete(game.tag);
					}
				}
			}
		}
		setTimeout(this.update, 16);
	};
}
