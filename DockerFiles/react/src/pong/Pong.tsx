import "./pong.game.css"

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
	const BACK_TO_MENU: string = '/pong/menu';
	const VICTORY: string = '/pong/endscreen?result=victory';
	const VICTORY_BY_FORFEIT: string = '/pong/endscreen?result=victory&forfeit=true';
	const VICTORY_ON_TIME: string = '/pong/endscreen?result=victory&flagged=true';
	const DEFEAT: string = '/pong/endscreen?result=defeat';
	const DEFEAT_ON_TIME: string = '/pong/endscreen?result=defeat&flagged=true';
	const DRAW: string = '/pong/endscreen?result=draw';
	const USE_SPELL: any = "+";

	let socket = socketManager.getPongSocket();
	while (!socket)
	{
		try
		{

		const token = SetParamsToGetPost().headers.Authorization;
		if (token !== null)
		{
			socketManager.initializePongSocket(token);
			socket = socketManager.getPongSocket();
		}

		}
		catch(error)
		{
			console.log("i'm a teapot");
		}
	}

	const navigate = useNavigate();
	let [leavingPage, setLeavingPage] = useState("");

	let waiting: HTMLElement | null;
	let cancer: HTMLElement | null;
	let buttonReady: HTMLElement | null;
	let buttonBack: HTMLElement | null;
	let buttonJoinQueue: HTMLElement | null;
	let buttonActivateVariant: HTMLElement | null;
	let buttonAcceptVariant: HTMLElement | null;
	let buttonDeclineVariant: HTMLElement | null;
	let variantMessage: HTMLElement | null;

	let p_score: HTMLElement | null;
	let o_score: HTMLElement | null;
	let p_name: HTMLElement | null;
	let o_name: HTMLElement | null;

	let game_id = -1;
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
	
	let time: number = 0;

	function back()
	{

		document.removeEventListener("mousemove", eMouseMoved);
		document.removeEventListener("keydown", eKeyPressed);
		document.removeEventListener("keyup", eKeyReleased);
		socket.emit('leaveQueue');
		if (game_id != -1)
		{
			socket.emit('leaveGame');
			window.alert("You just lost the game.");
		}
		setLeavingPage(BACK_TO_MENU);
	}

	function joinQueue()
	{
		try
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
			socket.emit('leaveQueue');
		};

		}
		catch (error)
		{
			console.log("i'm a teapot");
		}
	}

	function activateVariant(action: string)
	{
		try
		{

		if (action == "activate" && buttonActivateVariant)
		{
			buttonActivateVariant.remove();
			if (buttonAcceptVariant)
				buttonAcceptVariant.remove();
			if (buttonDeclineVariant)
				buttonDeclineVariant.remove();
		}
		else if (action == "accept" && buttonAcceptVariant)
		{
			buttonAcceptVariant.remove();
			if (buttonDeclineVariant)
				buttonDeclineVariant.remove();
		}
		socket.emit('activateVariant', {input: (game_id + 1)});

		}
		catch (error)
		{
			console.log("i'm a teapot");
		}
	}

	function declineVariant()
	{
		try
		{

		if (buttonDeclineVariant)
		{
			socket.emit('declineVariant', {input: (game_id + 1)});
			if (buttonAcceptVariant)
				buttonAcceptVariant.remove();
			buttonDeclineVariant.remove();
		}

		}
		catch (error)
		{
			console.log("i'm a teapot");
		}
	}

	function playerReady()
	{
		try
		{

		socket.emit('declineVariant', {input: (game_id + 1)});
		if (buttonActivateVariant)
			buttonActivateVariant.remove();
		if (buttonAcceptVariant)
			buttonAcceptVariant.remove();
		if (buttonDeclineVariant)
			buttonDeclineVariant.remove();
		if (variantMessage)
		{
			variantMessage.textContent = "variant is off";
			variantMessage.style.display = "flex";
		}

		if (buttonReady)
		{
			socket.emit('playerReady', { input: game_id + 1 });
			buttonReady.remove();
		}

		}
		catch (error)
		{
			console.log("i'm a teapot");
		}
	}

	function eKeyPressed(e: any)
	{
		try
		{

		if (e.key === USE_SPELL && !keyPressed)
		{
			keyPressed = true;
			socket.emit('useSpell', { input: (game_id + 1) });
		}

		}
		catch (error)
		{
			console.log("i'm a teapot");
		}
	}

	function eKeyReleased(e: any)
	{
		try
		{

		if (e.key === USE_SPELL)
		{
			console.log("spell used");
			keyPressed = false;
		}

		}
		catch (error)
		{
			console.log("i'm a teapot");
		}
	}

	function eMouseMoved(e: any)
	{
		try
		{
			
		if ((e.y / window.innerHeight * 100) >= 20 && (e.y / window.innerHeight * 100) <= 80)
			p_paddle.setPosition(e.y / (window.innerHeight) * 100 - 20);
		socket.emit('movePaddle', { gametag: (game_id + 1), position: p_paddle.pos });

		}
		catch (error)
		{
			console.log("i'm a teapot");
		}
	}

	useEffect(() =>
	{
		try
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
		buttonBack = document.getElementById("buttonBack");	
		buttonJoinQueue = document.getElementById("joinQueue");	
		buttonActivateVariant = document.getElementById("activateVariant");	
		buttonAcceptVariant = document.getElementById("acceptVariant");	
		buttonDeclineVariant = document.getElementById("declineVariant");	
		variantMessage = document.getElementById("variantMessage");	
		waiting = document.getElementById("waiting");
		cancer = document.getElementById("cancer");
		buttonReady = document.getElementById("player_ready");
		if (buttonReady)
			buttonReady.style.display = "none";
		if (waiting)
			waiting.style.display = "none";
		if (cancer)
			cancer.style.display = "none";
		if (buttonActivateVariant)
			buttonActivateVariant.style.display = "none";
		if (variantMessage)
			variantMessage.style.display = "none";
		if (buttonAcceptVariant)
			buttonAcceptVariant.style.display = "none";
		if (buttonDeclineVariant)
			buttonDeclineVariant.style.display = "none";
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
			try
			{

			if (response != "no duel pending")
				console.log(response);
	
			}
			catch (error)
			{
				console.log("i'm a teapot");
			}
		});

		socket.on('gameFound', (game_tag: number, player_name: string, opponent_name: string, player_tag: number) =>
		{
			try
			{
	
			document.removeEventListener("mousemove", eMouseMoved);
			document.removeEventListener("keydown", eKeyPressed);
			document.removeEventListener("keyup", eKeyReleased);

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
			if (cancer)
				cancer.style.display = "flex";
			if (buttonJoinQueue)
				buttonJoinQueue.remove();

			window.onpopstate = function(e: any)
			{
				socket.emit('leaveGame');
				window.alert("You just lost the game.");
			};
	
			}
			catch (error)
			{
				console.log("i'm a teapot");
			}
		});

		socket.on('playing', () =>
		{
			try
			{
	
			document.removeEventListener("mousemove", eMouseMoved);
			document.removeEventListener("keydown", eKeyPressed);
			document.removeEventListener("keyup", eKeyReleased);
			
			document.addEventListener("mousemove", eMouseMoved);
			document.addEventListener("keydown", eKeyPressed);
			document.addEventListener("keyup", eKeyReleased);
			
			if (buttonActivateVariant)
				buttonActivateVariant.remove();
			if (buttonAcceptVariant)
				buttonAcceptVariant.remove();
			if (buttonDeclineVariant)
				buttonDeclineVariant.remove();
	
			}
			catch (error)
			{
				console.log("i'm a teapot");
			}
	
		});	

		socket.on('update', (gameState: any) =>
		{
			try
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

			}
			catch (error)
			{
				console.log("i'm a teapot");
			}
		});

		socket.on('variantProposed', () =>
		{
			try
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
			if (buttonDeclineVariant)
				buttonDeclineVariant.style.display = "flex";
	
			}
			catch (error)
			{
				console.log("i'm a teapot");
			}
		});

		socket.on('variantOnOff', (activate: boolean) =>
		{
			try
			{

			let message: string;
			if (activate)
				message = "variant is on";
			else
				message = "variant is off";
			if (variantMessage)
			{
				variantMessage.textContent = message;
				variantMessage.style.display = "flex";
			}
			if (buttonAcceptVariant)
				buttonAcceptVariant.remove();
			if (buttonDeclineVariant)
				buttonDeclineVariant.remove();
	
			}
			catch (error)
			{
				console.log("i'm a teapot");
			}
		});

		socket.on('opponentReady', () =>
		{
			try
			{

			if (buttonActivateVariant)
				buttonActivateVariant.remove();
			if (buttonAcceptVariant)
				buttonAcceptVariant.remove();
			if (buttonDeclineVariant)
				buttonDeclineVariant.remove();
			if (variantMessage)
			{
				variantMessage.textContent = "variant is off";
				variantMessage.style.display = "flex";
			}
	
			}
			catch (error)
			{
				console.log("i'm a teapot");
			}
		});

		socket.on('opponentLeft', () =>
		{
			try
			{

			setLeavingPage(VICTORY_BY_FORFEIT);
	
			}
			catch (error)
			{
				console.log("i'm a teapot");
			}
		});

		socket.on('victory', (flag = false) =>
		{
			try
			{

			if (flag)
				setLeavingPage(VICTORY_ON_TIME);
			else
				setLeavingPage(VICTORY);
	
			}
			catch (error)
			{
				console.log("i'm a teapot");
			}
		});

		socket.on('defeat', (flag = false) =>
		{
			try
			{

			if (flag)
				setLeavingPage(DEFEAT_ON_TIME);
			else
				setLeavingPage(DEFEAT);
	
			}
			catch (error)
			{
				console.log("i'm a teapot");
			}
		});

		socket.on('draw', () =>
		{
			try
			{

			setLeavingPage(DRAW);
	
			}
			catch (error)
			{
				console.log("i'm a teapot");
			}
		});

		return (() =>
		{
				document.removeEventListener("mousemove", eMouseMoved);
				document.removeEventListener("keydown", eKeyPressed);
				document.removeEventListener("keyup", eKeyReleased);
				window.onpopstate = (e: any) => {};
		});

		}
		catch (error)
		{
			console.log("i'm a teapot");
		}
	}, []);

	useEffect(() =>
	{
		try
		{

		if (leavingPage != "")
			navigate(leavingPage);
	
		}
		catch (error)
		{
			console.log("i'm a teapot");
		}
	}, [leavingPage]);

	return (
			<div className="pongGame">
				<div className="pongTop">
					<div className="firstRow">
						<button className="buttonBack" id="buttonBack" onClick={back}>back</button>
						<h1 className="h1n1">PONG</h1>
					</div>
					<div className="secondRow">
						<button className="joinQueue" id="joinQueue" onClick={joinQueue}>join queue</button>
						<div className="waiting" id="waiting">waiting for an opponent...</div>
						<div className="cancer" id="cancer">
							<div className="name_p" id="p_name"></div>
							<div className="score_p" id="p_score"></div>
							<div className= "bar">|</div>
							<div className="name_o" id="o_name"></div>
							<div className="score_o" id="o_score"></div>
						</div>
					</div>
				</div>
				<div className="pongMid">
					<button className="player_ready" onClick={playerReady} id="player_ready">READY</button>
					<div className="upperbound"></div>
					<div className="ball" id="ball"></div>
					<div className="paddle left" id="p_paddle"></div>
					<div className="paddle right" id="o_paddle"></div>
					<div className="central_line"></div>
					<div className="lowerbound"></div>
				</div>
				<div className="pongBot">

					<div className="variant">

						<button className="buttonVariant" id="activateVariant" onClick={() => {activateVariant("activate")}}>activate variant</button>
						<div className="variantMessage" id="variantMessage"></div>

					</div>
					<div className="choice">

						<button className="buttonAcceptVariant" id="acceptVariant" onClick={() => {activateVariant("accept")}}>accept</button>
						<button className="buttonDeclineVariant" id="declineVariant" onClick={declineVariant}>decline</button>
					</div>
				</div>
			</div>
	);
}
