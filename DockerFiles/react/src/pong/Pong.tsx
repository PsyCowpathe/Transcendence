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

let socket = socketManager.getPongSocket();

export default function PongGame ()
{
	if (!socket)
	{
		const token = SetParamsToGetPost().headers.Authorization;
		if (token !== null)
      		{
			socketManager.initializePongSocket(token);
			socket = socketManager.getPongSocket();
		}
	}
	if (socket)
		socket.emit('joinQueue', window.localStorage.getItem("name"));
	
	const navigate = useNavigate();
	
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

	useEffect(() => {
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
		buttonReady = document.getElementById("player_ready");
		if (buttonReady)
			buttonReady.style.display = "none";
	}, []);

	socket.on('gameFound', (game_tag: number, player_name: string, opponent_name: string, player_tag: number) =>
	{
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
		ball = new Ball(document.getElementById("ball"));
		p_paddle = new Paddle(document.getElementById("p_paddle"));
		o_paddle = new Paddle(document.getElementById("o_paddle"));
		document.addEventListener("mousemove", eMouseMoved);
	});
	
	function eMouseMoved(e: any)
	{
		input = e.y - input;
		p_paddle.setPosition(100 * e.y / window.innerHeight);
		socket.emit('movePaddle', { input: player_id }, { input: game_id  + 1}, { input: p_paddle.pos } );
	}

	function playerReady()
	{
		if (buttonReady)
		{
			socket.emit('onPlayerReady', { input: game_id + 1 });
			buttonReady.style.display = "none";
		}
	}

	socket.on('GOOOAAAAAAL', (strikerID: number) =>
	{
		if (strikerID == player_id)
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
		if (player_id == 1)
		{
			o_paddle.setPosition(gameState.p2_paddlepos);
			p_paddle.setPosition(gameState.p1_paddlepos);
			ball.setPosition(gameState.ballpos);
			console.log("player1 pos : " + gameState.p1_paddlepos);
		}
		else
		{
			o_paddle.setPosition(gameState.p1_paddlepos);
			p_paddle.setPosition(gameState.p2_paddlepos);
			ball.setPosition({ x: (100 - gameState.ballpos.x),  y: gameState.ballpos.y });
		}
	});

	socket.on('opponentReady', () =>
	{
		console.log("opponent is ready");	
	});

	socket.on('opponentLeft', () =>
	{
		window.alert("Your opponent left the game. You win by forfeit");
		navigate('/');
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
