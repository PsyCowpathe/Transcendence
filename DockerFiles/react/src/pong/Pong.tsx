import "./styles.css"
import React from "react"
import { useState, useEffect, useRef, Ref } from "react"
import { io } from 'socker.io-client'

import Player from "./Player"
import Ball from "./Ball"
import Paddle from "./Paddle"
import moveBall from "./MoveBall"

export default function Pong ()
{

	let buttonReady: HTMLElement | null;
	let p_score: HTMLElement | null;
	let o_score: HTMLElement | null;
	let p_name: HTMLElement | null;
	let o_name: HTMLElement | null;
	
	let deltaTime: number = 0;
	let prevTime: number = 0;
	let ball: Ball;
	let p_paddle!: Paddle;
	let o_paddle!: Paddle;
	let player!: Player;
	let opponent!: Player;
	let playerID:number = 0;
	
	let input: number; 
	let GOAL:boolean = false;

	const socket = io('https://localhost:3000');

	const createBall = () =>
	{
		ball = new Ball(document.getElementById("ball"));
	}

	const createPaddles = () =>
	{
		p_paddle = new Paddle(document.getElementById("p_paddle"));
		o_paddle = new Paddle(document.getElementById("o_paddle"));
	}

	socket.on('createPlayers', (p1_name, p2_name, id) => {
	{
		playerID = id;
		if (id == 1)
		{
			player = new Player(p1_name, p_paddle);
			opponent = new Player(p2_name, o_paddle);
		}
		else
		{
			player = new Player(p2_name, p_paddle);
			opponent = new Player(p1_name, o_paddle);
		}
	});
	/*const createPlayers = () =>
	{
		player = new Player("name", p_paddle);
		opponent = new Player("name", o_paddle);
	}*/

	useEffect(() => {
		createBall();
		createPaddles();
		createPlayers();
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
			p_score.textContent = player.score;
			o_score.textContent = opponent.score;
		}
		document.addEventListener("mousemove", eMouseMoved);
	}, []);
	
	function eMouseMoved(e: any)
	{
		input = e.y - input;
		p_paddle.setPosition(100 * e.y / window.innerHeight);
		socket.emit('movePaddle', playerID, p_paddle.pos);
	}

	function playerReady()
	{
		if (buttonReady)
		{
			socket.emit
			buttonReady.style.display = "none";
		}
	}

	socket.on('GOOOAAAAAAL', strikerID)
	{
		if (strikerID == playerID && p_score)
		{
			player.score++;
			p_score.textContent = player.score;
		}
		else if (o_score)
		{
			opponent.score++;
			o_score.textContent = opponent.score;
		}
	}

	/*function update(time : number)
	{
		if (prevTime != 0 && ball)
		{
			deltaTime = time - prevTime;
			updatePositions();
		}
		prevTime = time;
		window.requestAnimationFrame(update);
		console.log(ball.pos.x);
	}*/

	socket.on('update', (gameState) =>
	{
		ball.setPosition(gameState.ballpos);
		if (playerID == 1)
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

	return (
			<div className="pong">
				<div className="text">
					<h1>PONG</h1>
					<div className="scores">
						<div className="name p1" id="p_name"></div>
						<div className= "score p1" id="p_score"></div>
						<div className= "bar">|</div>
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
