import { WebSocketServer, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage } from '@nestjs/websockets';

import { UseFilters, UsePipes, UseGuards, ValidationPipe } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { User } from '../../db/user/user.entity'
import { MatchHistory } from '../../db/game/game.entity'
import { UserService } from '../../db/user/user.service'
import { GameService } from '../../db/game/game.service'
import { RelationService } from '../../db/relation/relation.service'
import { WsStatusService } from '../status/wsstatus.service'
import Game from './class/Game';
import Player from './class/Player'
import { WsExceptionFilter } from '../guard/ws.filter';
import { SocketGuard } from '../guard/socket.guard';
import { errorMessages } from '../../common/global';
import { mouseDto, numberDto, posDto, answerDto } from './pong.entity'

@UseFilters(WsExceptionFilter)
@WebSocketGateway(3633, {cors: true})
export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	server: Server;

	clients = new Map<User, Socket>();
	queue = new Map<User, Socket>();
	games = new Map<number, Game>();
	duelists = new Map<{id1: number, id2: number}, {here1: boolean, here2: boolean}>();
	duelInvites = new Map<number, number>();
	numberOfGames:number = 0;

	constructor(	private readonly userService: UserService,
			private readonly statusService: WsStatusService,
			private readonly gameService: GameService,
			private readonly relationService: RelationService )
	{
	       this.update();
	}


	async handleConnection(socket: Socket)
	{
		let user: User | null = null;
   	 	const token = socket.handshake.auth.token;
    	const TWOFA = socket.handshake.auth.twoFAToken;
    	user = await this.userService.findOneByToken(token); 
    	if (user)
  	 	{
			if (user.token === token)
        	{
        	    if (user.TwoFA === true)
				{
                	if (Date.now().toString() > user.TwoFAExpire)
                	{
                    	socket.emit("GameError", errorMessages.INVALID2FA)
                    	socket.disconnect();
                	}
               		else if (TWOFA === user.TwoFAToken)
                	{
						for (const usr of this.clients.keys())
						{
							if (usr.id === user.id)
								this.clients.delete(usr);
						}
                		this.clients.set(user, socket);
                	}
                	else
                	{
                 		socket.emit("GameError", errorMessages.INVALID2FA)
                  		socket.disconnect();
                	} 
            	}
            	else
            	{
					for (const usr of this.clients.keys())
					{
						if (usr.id === user.id)
							this.clients.delete(usr);
					}
             		this.clients.set(user, socket);
					await this.statusService.changeStatus(user, "Online");
            	}
        	}

        	else
        	{
           		socket.emit("GameError", errorMessages.INVALIDTOKEN)
            	socket.disconnect();
        	}
    	}
    	else
    	{
       		socket.emit("GameError", errorMessages.MISSINGUSER)
        	socket.disconnect();
    	}
	}

	async handleDisconnect(socket: Socket)
	{
		const leaver = this.getUser(socket);
		if (leaver)
		{
			await this.statusService.changeStatus(leaver, "Offline");
			this.leaveGame(socket,leaver.id);
			this.leaveQueue(socket, leaver.id);
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

	getSocket(map: Map<User, Socket>, id: number) : Socket | undefined
    {
       	for (const [key, current] of map.entries())
       	{
           		if (key.id === id)
                 		return (current);
       	}
		return (undefined);
    }

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
				if (game.p1.user.id == user.id)
				{
					socket.emit("GameError", "already in game"); // A CHANGER
					return;
				}
			}
			for (const usr of this.queue.keys())
			{
				if (usr.id == user.id)
				{
					socket.emit("GameError", "already in queue"); // A CHANGER
					return;
				}
			}
			for (const duel of this.duelists.keys())
			{
				if (duel.id1 == user.id || duel.id2 == user.id)
				{
					socket.emit("GameError", "already in game"); // A CHANGER
					return;
				}
			}

			this.queue.set(user, socket);
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

	async addGame(p1: User, p2: User)
	{
		let s1 = this.getSocket(this.clients, p1.id);
		let s2 = this.getSocket(this.clients, p2.id);
		if (s1 && s2)
		{
			this.numberOfGames = this.numberOfGames + 1;
			await this.statusService.changeStatus(p1, "InGame");
			await this.statusService.changeStatus(p2, "InGame");
				s1.emit('gameFound', this.numberOfGames, p1.name, p2.name, 1);
				s2.emit('gameFound', this.numberOfGames, p2.name, p1.name, 2);
			this.games.set(this.numberOfGames, new Game(new Player(p1, s1.id), new Player(p2, s2.id), this.numberOfGames));
		console.log("created " + this.numberOfGames);

		}
	}

	@SubscribeMessage('leaveQueue')
	leaveQueue(socket: Socket, id: number = -1)
	{
		let user: User | undefined;

		user = this.getUser(socket);
		if (user)
			this.queue.delete(user);
		else
		{
			for (const leaver of this.queue.keys())
			{
				if (leaver.id === id)
					this.queue.delete(leaver);
			}
		}
	}

	@UsePipes(new ValidationPipe())
	@SubscribeMessage('leaveGame')
	async leaveGame(socket: Socket, id: number = -1)
	{
		let opp: User | undefined;
		const leaver = this.getUser(socket);
		if (leaver)
		{
			let oppSock: Socket | undefined;
			for (const game of this.games.values())
			{
				if (game.p1.user.id === leaver.id)
				{
					if (game.isFinished)
						return ;
					game.isFinished = true;
					oppSock = this.getSocket(this.clients, game.p2.user.id);
					let newMatchHistory = new MatchHistory();
					newMatchHistory.score1 = game.p2.score; 
					newMatchHistory.user1 = game.p2.user;
					newMatchHistory.score2 = game.p1.score;
					newMatchHistory.user2 = game.p1.user;
					socket.emit('defeat', game.timeisover);
					await this.gameService.createMatchHistory(newMatchHistory);
					await this.userService.addVictory(game.p2.user);
					await this.userService.addDefeat(game.p1.user);
					await this.userService.addMatch(game.p1.user);
					await this.userService.addMatch(game.p2.user);
		console.log("deleted " + game.tag);
					this.games.delete(game.tag);
				}
				else if (game.p2.user.id === leaver.id)
				{
					if (game.isFinished)
						return ;
					game.isFinished = true;
					oppSock = this.getSocket(this.clients, game.p1.user.id);
					let newMatchHistory = new MatchHistory();
					newMatchHistory.score1 = game.p1.score; 
					newMatchHistory.user1 = game.p1.user;
					newMatchHistory.score2 = game.p2.score;
					newMatchHistory.user2 = game.p2.user;
					socket.emit('victory', game.timeisover);
					await this.gameService.createMatchHistory(newMatchHistory);
					await this.userService.addVictory(game.p1.user);
					await this.userService.addDefeat(game.p2.user);
					await this.userService.addMatch(game.p1.user);
					await this.userService.addMatch(game.p2.user);
		console.log("deleted " + game.tag);

					this.games.delete(game.tag);
				}
				if (oppSock)
				{
					opp = this.getUser(oppSock);
					if (opp)
						await this.statusService.changeStatus(opp, "Online");
					oppSock.emit('opponentLeft');
					break;
				}
			}
			await this.statusService.changeStatus(leaver, "Online");
		}
		else if (id != -1)
		{
			let oppSock: Socket | undefined;
			for (const game of this.games.values())
			{
				if (game.p1.user.id === id)
				{
					if (game.isFinished)
						return ;
					game.isFinished = true;
					oppSock = this.getSocket(this.clients, game.p2.user.id);
					let newMatchHistory = new MatchHistory();
					newMatchHistory.score1 = game.p2.score; 
					newMatchHistory.user1 = game.p2.user;
					newMatchHistory.score2 = game.p1.score;
					newMatchHistory.user2 = game.p1.user;
					socket.emit('defeat', game.timeisover);
					await this.gameService.createMatchHistory(newMatchHistory);
					await this.userService.addVictory(game.p2.user);
					await this.userService.addDefeat(game.p1.user);
					await this.userService.addMatch(game.p1.user);
					await this.userService.addMatch(game.p2.user);
					this.games.delete(game.tag);
				}
				else if (game.p2.user.id === id)
				{
					if (game.isFinished)
						return ;
					game.isFinished = true;
					oppSock = this.getSocket(this.clients, game.p1.user.id);
					let newMatchHistory = new MatchHistory();
					newMatchHistory.score1 = game.p1.score; 
					newMatchHistory.user1 = game.p1.user;
					newMatchHistory.score2 = game.p2.score;
					newMatchHistory.user2 = game.p2.user;
					socket.emit('victory', game.timeisover);
					await this.gameService.createMatchHistory(newMatchHistory);
					await this.userService.addVictory(game.p1.user);
					await this.userService.addDefeat(game.p2.user);
					await this.userService.addMatch(game.p1.user);
					await this.userService.addMatch(game.p2.user);
					this.games.delete(game.tag);
				}
				if (oppSock)
				{
					opp = this.getUser(oppSock);
					if (opp)
						await this.statusService.changeStatus(opp, "Online");
					oppSock.emit('opponentLeft');
					break;
				}
			}
		}
	}

	@UsePipes(new ValidationPipe())
	@SubscribeMessage('sendDuel')
	async sendDuel(socket: Socket, opp_id: numberDto)
	{
		let user: User | undefined = this.getUser(socket);
		let opp: User | null = await this.userService.findOneById(opp_id.input);

		if (user && opp)
		{
			const relationStatus = await this.relationService.getRelationStatus(user, opp);
			if (relationStatus == "VX" || relationStatus == "enemy")
			{
				socket.emit("GameError", "this player blocked you");
				return;
			}
			if (relationStatus == "XV" || relationStatus == "enemy")
			{
				socket.emit("GameError", "you blocked this user");
				return;
			}
			if (user.id == opp.id)
			{
				socket.emit("GameError", "SOS Amitie : 04 73 37 37 37"); // A CHANGER
				return;
			
			}
			for (const [inviting, invited] of this.duelInvites.entries())
			{
				if (inviting === user.id)
				{
					socket.emit("GameError", "you already have a duel invite pending"); // A CHANGER
					return;
				}
				if (inviting === opp.id && invited === user.id)
				{
					socket.emit("GameError", "you were already invited by this player"); // A CHANGER
					return;
				}
			}
			for (const usr of this.queue.keys())
			{
				if (usr.id === user.id)
				{
					socket.emit("GameError", "already in queue"); // A CHANGER
					return;
				}
			}
			for (const game of this.games.values())
			{
				if (game.p1.user.id === user.id)
				{
					socket.emit("GameError", "already in game"); // A CHANGER
					return;
				}
			}
			for (const duel of this.duelists.keys())
			{
				if (duel.id1 === user.id)
				{
					socket.emit("GameError", "already in a duel"); // A CHANGER
					return;
				}
			}
			this.duelInvites.set(user.id, opp.id);
			const opp_sock = this.getSocket(this.clients, opp.id);
			if (opp_sock)
				opp_sock.emit('duelInviteReceived', user.name);

		}
		else
			socket.emit("GameError", errorMessages.INVALIDUSER);
	}


	@UsePipes(new ValidationPipe())
	@SubscribeMessage('answerDuel')
	async answerDuel(s1: Socket, answer: answerDto)
	{
		let player1: User | null = await this.userService.findOneById(answer.id1); 
		let player2: User | null = await this.userService.findOneById(answer.id2); 
		let s2!: Socket | undefined;
		let wasInvited: boolean = false;

		if (player1 && player2)
		{
			const relationStatus = await this.relationService.getRelationStatus(player1, player2);
			if (answer.inviteAccepted && (relationStatus == "VX" || relationStatus == "enemy"))
			{
				s1.emit("GameError", "this player blocked you");
				return;
			}
			if (answer.inviteAccepted && (relationStatus == "XV" || relationStatus == "enemy"))
			{
				s1.emit("GameError", "you blocked this user");
				return;
			}
			for (const game of this.games.values())
			{
				if (game.p1.user.id == player1.id || game.p2.user.id == player1.id)
				{
					s1.emit("GameError", "in game"); // A CHANGER
					return;
				}
				if (	(answer.inviteAccepted && 
					 ((game.p1.user.id == player2.id) || (game.p2.user.id == player2.id))))
				{
					s1.emit("GameError", `${player2.name} is currently in game`); // A CHANGER
					return;
				}
			}
			for (const usr of this.queue.keys())
			{
				if (usr.id === player1.id)
				{
					s1.emit("GameError", "in queue"); // A CHANGER
					return;
				}
				if (answer.inviteAccepted && (usr.id === player2.id))
				{
					s1.emit("GameError", `${player2.name} is currently in queue`); // A CHANGER
					return;
				}
			}
			for (const duel of this.duelists.keys())
			{
				if (duel.id1 === player1.id || duel.id2 === player1.id)
				{
					s1.emit("GameError", "in game"); // A CHANGER
					return;
				}
				if (answer.inviteAccepted && ((duel.id1 === player2.id) || (duel.id2 === player2.id)))
				{
					s1.emit("GameError", `${player2.name} is currently in game`); // A CHANGER
					return;
				}
			}
			for (const [inviting, invited] of this.duelInvites.entries())
			{
				if (inviting === answer.id2 && invited === answer.id1)
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
			
			player2 = await this.userService.findOneById(answer.id2); 
			if (player2)
			{
				if (player2.Status != "Offline")
				{
					s2 = this.getSocket(this.clients, player2.id);
					if (s2)
					{
						s2.emit('duelInviteAnswered', player1.name, answer.inviteAccepted);
					}
					this.duelInvites.delete(answer.id2);
					s1.emit('refreshInvites', "that parameters system is dumb");
					if (answer.inviteAccepted === true)
					{
						this.addGame(player1, player2);	
						this.duelists.set({id1: player1.id, id2: player2.id}, {here1: false, here2: false});
						this.spamJoinDuel(s1, player1.id, 1);
						if (s2)
							this.spamJoinDuel(s2, player2.id, 2);
					}
				}
				else if (player2.Status === "Offline") 
				{
					s1.emit('GameError', "opponent unavailable (status: Offline)"); // A CHANGER
					if (answer.inviteAccepted === false)
					{
						this.duelInvites.delete(answer.id2);
						s1.emit('refreshInvites', "that parameters system is dumb");
					}
				}
			}
		}
		else
			s1.emit('GameError', errorMessages.INVALIDUSER);
	}

	async spamJoinDuel(socket: Socket, id: number, player: number)
	{
		let foundem: boolean = false;
		let duelist_id: number = 0;
		while (1)
		{
			for (const [players, status] of this.duelists.entries())
			{
				foundem = true;
				if (player == 1)
				{
					duelist_id = players.id1;
					if (status.here1 == true)
						return;
				}
				else if (player == 2)
				{
					duelist_id = players.id2;
					if (status.here2 == true)
						return;
				}
				if (duelist_id == id)
				{
					await socket.emit('joinDuel', "a parameter cause it allows none but it doesnt work without one");
					await socket.emit('duelInviteAnswered', "ntm", false, "join");
					await new Promise(r => setTimeout(r, 500));
				}
			}
			if (!foundem)
				return;
			foundem = false;
		}
	}

	@SubscribeMessage('accessDuel')
	async accessDuel(socket: Socket)
	{
		let player: User | undefined = this.getUser(socket); 

		if (player)
		{
			for (const [players, status] of this.duelists.entries())
			{
				if (players.id1 == player.id)
				{
					for (const game of this.games.values())
					{
						if (game.p1.user.id === player.id)
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
					return;
				}
				else if (players.id2 == player.id)
				{
					for (const game of this.games.values())
					{
						if (game.p2.user.id === player.id)
						{
							game.p2.sockid = socket.id;
							socket.emit('gameFound', game.tag, game.p2.name, game.p1.name, 2);
							break;
						}
					}
					if (!status.here1)
						this.duelists.set(players, {here1: false, here2: true});
					else
						this.duelists.delete(players);
					return;
				}
			}
		}
	}

	@SubscribeMessage('getInvites')
	async getInvites(socket: Socket)
	{
		let player = this.getUser(socket);
		let invitesReceived = new Array<{ name: string, uid: number }>();
		let invitesSent = new Array<{ name: string, uid: number }>();
		
		if (player && invitesReceived && invitesSent)
		{
			for (const [inviting_id, invited_id] of this.duelInvites.entries())
			{
				if (invited_id === player.id)
				{
					const opponent = await this.userService.findOneById(inviting_id);
					if (opponent)
						invitesReceived.push({ name: opponent.name, uid: inviting_id });
				}
				if (inviting_id === player.id)
				{
					const opponent = await this.userService.findOneById(invited_id);
					if (opponent)
						invitesSent.push({ name: opponent.name, uid: invited_id });
				}
			}
			socket.emit('invitesList', invitesReceived, invitesSent);
		}
	}

	@UsePipes(new ValidationPipe())
	@SubscribeMessage('cancelInvite')
	async cancelInvite(socket: Socket, id: numberDto)
	{
		let player = this.getUser(socket);
		let opp = await this.userService.findOneById(id.input);

		if (player)
		{
			for (const [inviting_id, invited_id] of this.duelInvites.entries())
			{
				if (inviting_id === player.id && invited_id === id.input)
				{
					this.duelInvites.delete(inviting_id);
					socket.emit('');
					if (opp)
					{
						const s2 = this.getSocket(this.clients, id.input);	
						if (s2)
							s2.emit('duelInviteCanceled', player.name);
					}
					socket.emit('refreshInvites', "blblbl");
				}
			}
		}

	}

	@UsePipes(new ValidationPipe())
	@SubscribeMessage('activateVariant')
	activateVariant(socket: Socket, tag: numberDto)
	{
		const game = this.games.get(tag.input - 1);
		let s1!: Socket | undefined;
		let s2!: Socket | undefined;
		
		if (game && !game.playing && !game.p1_ready && !game.p2_ready && !game.variantProposed)
		{
			game.variantProposed = true;
			s1 = this.getSocket(this.clients, game.p1.user.id);
			s2 = this.getSocket(this.clients, game.p2.user.id);
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


	@UsePipes(new ValidationPipe())
	@SubscribeMessage('acceptVariant')
	acceptVariant(socket: Socket, tag: numberDto)
	{
		const game = this.games.get(tag.input - 1);
		let s1!: Socket | undefined;
		let s2!: Socket | undefined;
		
		if (game && !game.playing && !game.p1_ready && !game.p2_ready)
		{
			s1 = this.getSocket(this.clients, game.p1.user.id);
			s2 = this.getSocket(this.clients, game.p2.user.id);
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

	@UsePipes(new ValidationPipe())
	@SubscribeMessage('declineVariant')
	declineVariant(socket: Socket, tag: numberDto)
	{
		const game = this.games.get(tag.input - 1);
		let s1!: Socket | undefined;
		let s2!: Socket | undefined;
		
		if (game && !game.playing && !game.p1_ready && !game.p2_ready)
		{
			s1 = this.getSocket(this.clients, game.p1.user.id);
			s2 = this.getSocket(this.clients, game.p2.user.id);
			if (game.p1.sockid == socket.id && game.p1_variant == false)
			{
    				game.p1_variant = false;
				if (s1 && s2)
				{
					s1.emit('variantOnOff', false);
					s2.emit('variantOff', false);
				}
			}
			else if	(game.p2.sockid == socket.id && game.p2_variant == false)
			{
    				game.p2_variant = false;
				if (s1 && s2)
				{
					s1.emit('variantOnOff', false);
					s2.emit('variantOnOff', false);
				}
			}
		}	
	}

	@UsePipes(new ValidationPipe())
	@SubscribeMessage('playerReady')
	async playerReady(socket: Socket, gametag: numberDto)
	{
		let s1: Socket | undefined;
		let s2: Socket | undefined;
		const game = this.games.get(gametag.input - 1);

		if (game)
		{
			s1 = this.getSocket(this.clients, game.p1.user.id);
			s2 = this.getSocket(this.clients, game.p2.user.id);
		}
	
		const user = this.getUser(socket);
		if (user && game && !game.playing)
		{
			if (user.id === game.p1.user.id)
			{
				game.p1_ready = true;
				if (s2)
					s2.emit("opponentReady");
				if (game.p1_ready && game.p2_ready)
				{
					game.start();
					if (s1 && s2)
					{
						s1.emit('playing');
						s2.emit('playing');
					}
				}
			}
			else if (user.id === game.p2.user.id)
			{
				game.p2_ready = true;
				if (s1)
					s1.emit("opponentReady");
				if (game.p1_ready && game.p2_ready)
				{
					game.start();
					if (s1 && s2)
					{
						s1.emit('playing');
						s2.emit('playing');
					}
				}
			}
			else
			{
				socket.emit('GameError', errorMessages.NOTAPLAYER);
				return;
			}
		}
	}

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

	update = async () =>
	{
		for (const game of this.games.values())
		{
			const s1 = this.getSocket(this.clients, game.p1.user.id);
			const s2 = this.getSocket(this.clients, game.p2.user.id);
			if (s1 && s2)
			{
				const gameState = game.getGameState();
				s1.emit('update', gameState);
				s2.emit('update', gameState);
			  	if (game.winner)
				{
					await this.userService.updateStatus("Online", game.p1.user);
					await this.userService.updateStatus("Online", game.p2.user);
					this.games.delete(game.tag);
					let newMatchHistory = new MatchHistory();
					if (game.winner == 1)
					{
						newMatchHistory.score1 = game.p1.score; 
						newMatchHistory.user1 = game.p1.user;
						newMatchHistory.score2 = game.p2.score;
						newMatchHistory.user2 = game.p2.user;
						s1.emit('victory', game.timeisover);
						s2.emit('defeat', game.timeisover);
						await this.userService.addVictory(game.p1.user);
						await this.userService.addDefeat(game.p2.user);
						await this.userService.addMatch(game.p1.user);
						await this.userService.addMatch(game.p2.user);
					}
					else if (game.winner == 2)
					{
						newMatchHistory.score1 = game.p2.score; 
						newMatchHistory.user1 = game.p2.user;
						newMatchHistory.score2 = game.p1.score;
						newMatchHistory.user2 = game.p1.user;
						s2.emit('victory', game.timeisover);
						s1.emit('defeat', game.timeisover);
						await this.userService.addVictory(game.p2.user);
						await this.userService.addDefeat(game.p1.user);
						await this.userService.addMatch(game.p1.user);
						await this.userService.addMatch(game.p2.user);
					}
					else
					{
						newMatchHistory.score1 = game.p2.score; 
						newMatchHistory.user1 = game.p2.user;
						newMatchHistory.score2 = game.p1.score;
						newMatchHistory.user2 = game.p1.user;
						s1.emit('draw');
						s2.emit('draw');
						await this.userService.addVictory(game.p1.user);
						await this.userService.addVictory(game.p2.user);
						await this.userService.addMatch(game.p1.user);
						await this.userService.addMatch(game.p2.user);
					}
					await this.gameService.createMatchHistory(newMatchHistory);
				}
			}
		}
		setTimeout(this.update, 16);
	};
}

