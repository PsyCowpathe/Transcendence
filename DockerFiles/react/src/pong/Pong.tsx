import "./styles.css"
import React from "react"
import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef, Ref } from "react"
import { io } from 'socket.io-client'

import Player from "./Player"
import Ball from "./Ball"
import Paddle from "./Paddle"

export default function PongGame ()
{

	const { role } = useParams();

	let buttonReady: HTMLElement | null;
	let p_score: HTMLElement | null;
	let o_score: HTMLElement | null;
	let p_name: HTMLElement | null;
	let o_name: HTMLElement | null;
	
	let game_id = 0;
	let deltaTime: number = 0;
	let prevTime: number = 0;
	let ball: Ball;
	let p_paddle!: Paddle;
	let o_paddle!: Paddle;
	let player: Player = new Player("name");
	let opponent: Player = new Player("waiting for other player...");
	
	let input: number; 
	let GOAL:boolean = false;

	const socket = io('https://localhost:3000', {query: { username: player.name } });

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
		if (role == "spectator" && buttonReady)
			buttonReady.style.display = "none";
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

	socket.on('gameFound', (id: number, opponent_name: string, player_id: number) =>
	{
		opponent.name = opponent_name;
		if (o_name && o_score)
		{
			o_name.textContent = opponent.name;
			o_score.textContent = opponent.score.toString();
		}
		game_id = game_id;
		player.id = player_id;
		if (role != "spectator")
			document.addEventListener("mousemove", eMouseMoved);
	});
	
	function eMouseMoved(e: any)
	{
		input = e.y - input;
		p_paddle.setPosition(100 * e.y / window.innerHeight);
		socket.emit('movePaddle', player.id, p_paddle.pos);
	}

	function playerReady()
	{
		if (buttonReady && role != "spectator")
		{
			socket.emit('playerReady', player.id);
			buttonReady.style.display = "none";
		}
	}

	socket.on('GOOOAAAAAAL', (strikerID) =>
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

	socket.on('update', (gameState) =>
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

	socket.on('opponentLeft', () =>
	{
		console.log("lol");
	});

	return (
			<div className="pong game">
				<div className="text">
					<h1>PONG</h1>
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
