import "./styles.css"
import React from "react"
import { useLocation } from 'react-router-dom';
import { useState, useEffect, useRef, Ref } from "react"
import { io } from 'socket.io-client'

import { socketManager } from '../Pages/HomePage'
import { SetParamsToGetPost } from '../Headers/HeaderManager'
import Player from "./Player"
import Ball from "./Ball"
import Paddle from "./Paddle"

export default function PongGame ()
{
	let buttonReady: HTMLElement | null;
	let p_score: HTMLElement | null;
	let o_score: HTMLElement | null;
	let p_name: HTMLElement | null;
	let o_name: HTMLElement | null;
	
	let game_id = 0;
	let player_id = 0;
	let deltaTime: number = 0;
	let prevTime: number = 0;
	let ball: Ball;
	let p_paddle!: Paddle;
	let o_paddle!: Paddle;
	let player: Player = new Player(window.localStorage.getItem("name"));
	let opponent: Player = new Player("waiting for other player...");
	
	let input: number; 
	let GOAL:boolean = false;

	let test: boolean = false;
	let socket = socketManager.getChatSocket();
	while (!socket)
	{
    		if (test === false && SetParamsToGetPost().headers.Authorization !== null)
		{
      			socket = socketManager.initializePongSocket(SetParamsToGetPost().headers.Authorization)
      			console.log(socket)
			if (socket)
      				test = true;
    		}
	}	

	const createBall = () =>
	{
		ball = new Ball(document.getElementById("ball"));
	}

	const createPaddles = () =>
	{
		p_paddle = new Paddle(document.getElementById("p_paddle"));
		o_paddle = new Paddle(document.getElementById("o_paddle"));
	}

	useEffect(() => {
		createBall();
		createPaddles();
		buttonReady = document.getElementById("player_ready");
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
	}, []);

	socket.on('gameFound', (id: number, player_name: string, opponent_name: string, player_id: number) =>
	{
		player.name = player_name;
		opponent.name = opponent_name;
		if (o_name && p_name)
		{
			p_name.textContent = player.name;
			o_name.textContent = opponent.name;
		}
		game_id = game_id;
		player_id = player_id;
		document.addEventListener("mousemove", eMouseMoved);
	});

	/*socket.on('youreASpectatorPeasant', (id: number, player_name: string, opponent_name: string) =>
	{
		if (id == 3 && buttonReady)
			buttonReady.style.display = "none";
		player.name = player_name;
		opponent.name = opponent_name;
		if (o_name && p_name)
		{
			p_name.textContent = player.name;
			o_name.textContent = opponent.name;
		}
		player.id = player_id;
	});*/
	
	function eMouseMoved(e: any)
	{
		input = e.y - input;
		p_paddle.setPosition(100 * e.y / window.innerHeight);
		socket.emit('movePaddle', player.id, p_paddle.pos);
	}

	function playerReady()
	{
		if (buttonReady)
		{
			socket.emit('playerReady', player.id);
			buttonReady.style.display = "none";
		}
	}

	socket.on('GOOOAAAAAAL', (strikerID: number) =>
	{
		if (strikerID == player.id)
		{
			player.score++;
			if (p_score)
				p_score.textContent = player.score.toString();
		}
		else
		{
			opponent.score++;
			if (o_score)
				o_score.textContent = opponent.score.toString();
		}
	});

	socket.on('update', (gameState: any) =>
	{
		ball.setPosition(gameState.ballpos);
		if (player.id == 1)
		{
			o_paddle.setPosition(gameState.p2_paddlepos);
			p_paddle.setPosition(gameState.p1_paddlepos);
		}
		else
		{
			o_paddle.setPosition(gameState.p1_paddlepos);
			p_paddle.setPosition(gameState.p2_paddlepos);
		}
	});

	socket.on('opponentReady', () =>
	{
		console.log("lol");
	});

	socket.on('opponentLeft', () =>
	{
		console.log("lol");
	});

	return (
			<div className="pong game">
				<div className="text">
					<h1 className="h1 nº1">PONG</h1>
					<div className="scores">
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
			</div>
		);
}
