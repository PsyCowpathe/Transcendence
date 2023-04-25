import "./styles.css"
import React from "react"
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef, Ref } from "react"
import { io } from 'socket.io-client'

import socketManager from '../MesSockets'
import { SetParamsToGetPost } from "../Headers/HeaderManager"
import Player from "./Player"
import Ball from "./Ball"
import Paddle from "./Paddle"

export default function PongGame ()
{
	const VICTORY: string = '/pong/endscreen?result=victory';
	const VICTORY_BY_FORFEIT: string = '/pong/endscreen?result=victory&forfeit=true';
	const VICTORY_ON_TIME: string = '/pong/endscreen?result=victory&flagged=true';
	const DEFEAT: string = '/pong/endscreen?result=defeat';
	const DEFEAT_ON_TIME: string = '/pong/endscreen?result=defeat&flagged=true';
	const DRAW: string = '/pong/endscreen?result=draw';
	const USE_SPELL: any = "+";

	let socket = socketManager.getPongSocket();
	if (!socket)
	{
		const token = SetParamsToGetPost().headers.Authorization;
		if (token !== null)
		{
			socketManager.initializePongSocket(token);
			socket = socketManager.getPongSocket();
		}
	}

	const navigate = useNavigate();
	let [leavingPage, setLeavingPage] = useState("");

	let waiting: HTMLElement | null;
	let scores: HTMLElement | null;
	let buttonReady: HTMLElement | null;
	let buttonJoinQueue: HTMLElement | null;
	let buttonActivateVariant: HTMLElement | null;
	let buttonAcceptVariant: HTMLElement | null;
	let buttonRejectVariant: HTMLElement | null;
	let variantMessage: HTMLElement | null;
	let p_score: HTMLElement | null;
	let o_score: HTMLElement | null;
	let p_name: HTMLElement | null;
	let o_name: HTMLElement | null;

	let game_id = 0;
	let player_id = 0;
	let playing: boolean = false;

	let ball: Ball;
	let p_paddle!: Paddle;
	let o_paddle!: Paddle;
	let player: Player = new Player(window.localStorage.getItem("name"));
	let opponent: Player = new Player("name");

	let input: number; 
	let keyPressed: boolean = false;
	let GOAL:boolean = false;

	/*	useEffect(() => {
		ball = new Ball(document.getElementById("ball"));
		p_paddle = new Paddle(document.getElementById("p_paddle"));
		o_paddle = new Paddle(document.getElementById("o_paddle"));
		p_name = document.getElementById("p_name");
		o_name = document.getElementById("o_name");
		if (p_name && o_name)
		{
		p_name.textContent = player.name;
		o_name.textContent = opponent.name;
		}
		p_score = document.getElementById("p_score");
		o_score = document.getElementById("o_score");
		if (p_score && o_score)
		{
		p_score.textContent = player.score.toString();
		o_score.textContent = opponent.score.toString();
		}
		buttonJoinQueue = document.getElementById("joinQueue");	
		buttonActivateVariant = document.getElementById("activateVariant");	
		buttonAcceptVariant = document.getElementById("acceptVariant");	
		buttonRejectVariant = document.getElementById("rejectVariant");	
		variantMessage = document.getElementById("variantMessage");	
		waiting = document.getElementById("waiting");
		scores = document.getElementById("scores");
		buttonReady = document.getElementById("player_ready");
		if (buttonReady)
		buttonReady.style.display = "none";
		if (waiting)
		waiting.style.display = "none";
		if (scores)
		scores.style.display = "none";
		if (buttonActivateVariant)
		buttonActivateVariant.style.display = "none";
		if (variantMessage)
		variantMessage.style.display = "none";
		if (buttonAcceptVariant)
		buttonAcceptVariant.style.display = "none";
		if (buttonRejectVariant)
		buttonRejectVariant.style.display = "none";
		if (socket)
		socket.emit('accessDuel');
		window.onunload = function(e: any)
		{
		window.removeEventListener("mousemove", eMouseMoved);
		};
		}, []);*/


	function joinQueue()
	{
		if (socket)
			socket.emit('joinQueue', window.localStorage.getItem("name"));
		if (buttonJoinQueue)
		{
			buttonJoinQueue.remove();
			if (waiting)
				waiting.style.display = "flex";
		}
		window.onpopstate = function(e: any)
		{
			//window.removeEventListener('mousemove', eMouseMoved);

			socket.emit('leaveQueue');
			socket.emit('leaveGame');
			window.alert("You just lost the game.");
		};
	}

	function activateVariant(action: string)
	{
		if (action == "activate" && buttonActivateVariant)
		{
			buttonActivateVariant.remove();
			if (buttonAcceptVariant)
				buttonAcceptVariant.remove();
			if (buttonRejectVariant)
				buttonRejectVariant.remove();
		}
		else if (action == "accept" && buttonAcceptVariant)
		{
			buttonAcceptVariant.remove();
			if (buttonRejectVariant)
				buttonRejectVariant.remove();
		}
		socket.emit('activateVariant', {input: (game_id + 1)});
	}

	function rejectVariant()
	{
		if (buttonRejectVariant)
		{
			socket.emit('rejectVariant', {input: (game_id + 1)});
			if (buttonAcceptVariant)
				buttonAcceptVariant.remove();
			buttonRejectVariant.remove();
		}
	}

	function playerReady()
	{
		if (buttonReady)
		{
			socket.emit('playerReady', { input: game_id + 1 });
			buttonReady.remove();
		}
	}

	function eKeyPressed(e: any)
	{
		if (e.key === USE_SPELL && !keyPressed)
		{
			keyPressed = true;
			socket.emit('useSpell', { input: (game_id + 1) });
		}
	}

	function eKeyReleased(e: any)
	{
		if (e.key === USE_SPELL)
			keyPressed = false;
	}

	function eMouseMoved(e: any)
	{
		p_paddle.setPosition(100 * e.y / window.innerHeight);
		socket.emit('movePaddle', { gametag: (game_id + 1), position: p_paddle.pos });
	}

	useEffect(() =>
	{
		ball = new Ball(document.getElementById("ball"));
		p_paddle = new Paddle(document.getElementById("p_paddle"));
		o_paddle = new Paddle(document.getElementById("o_paddle"));
		p_name = document.getElementById("p_name");
		o_name = document.getElementById("o_name");
		if (p_name && o_name)
		{
			p_name.textContent = player.name;
			o_name.textContent = opponent.name;
		}
		p_score = document.getElementById("p_score");
		o_score = document.getElementById("o_score");
		if (p_score && o_score)
		{
			p_score.textContent = player.score.toString();
			o_score.textContent = opponent.score.toString();
		}
		buttonJoinQueue = document.getElementById("joinQueue");	
		buttonActivateVariant = document.getElementById("activateVariant");	
		buttonAcceptVariant = document.getElementById("acceptVariant");	
		buttonRejectVariant = document.getElementById("rejectVariant");	
		variantMessage = document.getElementById("variantMessage");	
		waiting = document.getElementById("waiting");
		scores = document.getElementById("scores");
		buttonReady = document.getElementById("player_ready");
		if (buttonReady)
			buttonReady.style.display = "none";
		if (waiting)
			waiting.style.display = "none";
		if (scores)
			scores.style.display = "none";
		if (buttonActivateVariant)
			buttonActivateVariant.style.display = "none";
		if (variantMessage)
			variantMessage.style.display = "none";
		if (buttonAcceptVariant)
			buttonAcceptVariant.style.display = "none";
		if (buttonRejectVariant)
			buttonRejectVariant.style.display = "none";
		if (socket)
			socket.emit('accessDuel');
		if (!socket)
		{
			const token = SetParamsToGetPost().headers.Authorization;
			if (token !== null)
			{
				socketManager.initializePongSocket(token);
				socket = socketManager.getPongSocket();
			}
		}

		// SOCKET EVENT LISTENERS //////////////////////////////////////////////////////////

		socket.on('GameError', (response: any) =>
		{
			console.log(response);
		});

	/*	socket.on('startDuel', (game_tag: number, player_name: string, opponent_name: string, player_tag: number) =>
		{
			socket.off('joinQueue');
			socket.off('gameFound');

			if (waiting)
				waiting.remove();
			if (buttonJoinQueue)
				buttonJoinQueue.remove();
			if (buttonActivateVariant)
				buttonActivateVariant.style.display = "flex";

			player.name = player_name;
			opponent.name = opponent_name;
			if (o_name && p_name)
			{
				p_name.textContent = player.name;
				o_name.textContent = opponent.name;
			}
			game_id = game_tag;
			player_id = player_tag;
			if (buttonReady)
				buttonReady.style.display = "flex";
			if (scores)
				scores.style.display = "flex";
		});*/

		socket.on('gameFound', (game_tag: number, player_name: string, opponent_name: string, player_tag: number) =>
		{
			socket.off('joinQueue');
			socket.off('gameFound');
			
			player.name = player_name;
			opponent.name = opponent_name;
			if (o_name && p_name)
			{
				p_name.textContent = player.name;
				o_name.textContent = opponent.name;
			}
			game_id = game_tag;
			player_id = player_tag;
			if (buttonReady)
				buttonReady.style.display = "flex";
			if (buttonActivateVariant)
			{
				buttonActivateVariant.style.display = "flex";
			}
			if (waiting)
				waiting.remove();
			if (scores)
				scores.style.display = "flex";
			if (buttonJoinQueue)
				buttonJoinQueue.remove();

			window.onpopstate = function(e: any)
			{
				socket.emit('leaveGame');
				window.alert("You just lost the game.");
			};
		});

		socket.on('playing', () =>
		{
			document.addEventListener("keydown", eKeyPressed);
			document.addEventListener("keyup", eKeyReleased);
			document.addEventListener("mousemove", eMouseMoved);
			if (buttonActivateVariant)
				buttonActivateVariant.remove();
			if (buttonAcceptVariant)
				buttonAcceptVariant.remove();
			if (buttonRejectVariant)
				buttonRejectVariant.remove();
		});

		socket.on('update', (gameState: any) =>
		{
			if (player_id == 1)
			{
				o_paddle.setPosition(gameState.p2_paddle_pos);
				p_paddle.setPosition(gameState.p1_paddle_pos);
				p_paddle.setSize(gameState.p1_paddle_size);
				o_paddle.setSize(gameState.p2_paddle_size);
				ball.setPosition(gameState.ballpos);
				if (p_score && o_score)
				{
					p_score.textContent = gameState.p1_score.toString();
					o_score.textContent = gameState.p2_score.toString();
				}
			}
			else if (player_id == 2)
			{
				o_paddle.setPosition(gameState.p1_paddle_pos);
				p_paddle.setPosition(gameState.p2_paddle_pos);
				p_paddle.setSize(gameState.p2_paddle_size);
				o_paddle.setSize(gameState.p1_paddle_size);
				ball.setPosition({ x: (100 - gameState.ballpos.x),  y: gameState.ballpos.y });
				if (p_score && o_score)
				{
					p_score.textContent = gameState.p2_score.toString();
					o_score.textContent = gameState.p1_score.toString();
				}
			}
		});

		socket.on('variantProposed', () =>
		{
			if (buttonActivateVariant)
				buttonActivateVariant.remove();
			if (variantMessage)
			{
				variantMessage.style.display = "flex";
				variantMessage.textContent = "your opponent wants to activate the variant";
			}
			if (buttonAcceptVariant)
				buttonAcceptVariant.style.display = "flex";
			if (buttonRejectVariant)
				buttonRejectVariant.style.display = "flex";
		});

		socket.on('variantOnOff', (activate: boolean) =>
		{
			let message: string;
			if (activate)
				message = "variant is off"
			else
				message = "variant is off"
			if (variantMessage)
				variantMessage.textContent = message;
			if (buttonAcceptVariant)
				buttonAcceptVariant.remove();
			if (buttonRejectVariant)
				buttonRejectVariant.remove();
		});

		socket.on('opponentReady', () =>
		{
			console.log("opponent is ready");
		});

		socket.on('opponentLeft', () =>
		{
			setLeavingPage(VICTORY_BY_FORFEIT);
		});

		socket.on('victory', (flag = false) =>
		{
			if (flag)
				setLeavingPage(VICTORY_ON_TIME);
			else
				setLeavingPage(VICTORY);
		});

		socket.on('defeat', (flag = false) =>
		{
			if (flag)
				setLeavingPage(DEFEAT_ON_TIME);
			else
				setLeavingPage(DEFEAT);
		});

		socket.on('draw', () =>
		{
			setLeavingPage(DRAW);
		});
	}, []);		

	useEffect(() =>
	{
		if (leavingPage != "")
			navigate(leavingPage);
	}, [leavingPage]);

	return (
			<div className="pong game">
				<div className="top">
					<h1 className="h1 nº1">PONG</h1>
					<button className="joinQueue" id="joinQueue" onClick={joinQueue}>join queue</button>
					<div className="waiting" id="waiting">waiting for an opponent...</div>
					<div className="scores" id="scores">
						<div className="name p1" id="p_name"></div>
						<div className= "score p1" id="p_score"></div>
						<div className= "score bar">|</div>
						<div className="score o" id="o_score"></div>
						<div className="name o" id="o_name"></div>
					</div>
				</div>
				<button className="player_ready" onClick={playerReady} id="player_ready"></button>
				<div className="game">
					<div className="ball" id="ball"></div>
					<div className="paddle left" id="p_paddle"></div>
					<div className="paddle right" id="o_paddle"></div>
					<div className="upperbound"></div>
					<div className="central_line"></div>
					<div className="lowerbound"></div>
				</div>
				<div className="bot">
					<button className="variant button" id="activateVariant" onClick={() => {activateVariant("activate")}}>activate variant</button>
					<div className="variant message" id="variantMessage"></div>
					<button className="variant accept" id="acceptVariant" onClick={() => {activateVariant("accept")}}>accept</button>
					<button className="variant reject" id="rejectVariant" onClick={rejectVariant}>reject</button>
				</div>
			</div>
			);
}
