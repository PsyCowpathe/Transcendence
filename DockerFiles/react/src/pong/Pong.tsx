import "./styles.css";
import React from "react";
import { useState, useEffect, useRef, Ref } from "react";

import Player from "./Player"
import Ball from "./Ball";
import Paddle from "./Paddle";
import moveBall from "./MoveBall";

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
	
	let input: number; 
	let GOAL:boolean = false;

	const createBall = () =>
	{
		ball = new Ball(document.getElementById("ball"));
		ball.reset();
	}
	const createPaddles = () =>
	{
		p_paddle = new Paddle(document.getElementById("p_paddle"));
		o_paddle = new Paddle(document.getElementById("o_paddle"));
	}
	const createPlayers = () =>
	{
		player = new Player("name", p_paddle);
		opponent = new Player("name", o_paddle);
	}

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
	
	/*client*/ function eMouseMoved(e: any)
	{
		input = e.y - input;
		p_paddle.setPosition(100 * e.y / window.innerHeight);
		/*send pos to server*/
	}

	function playerReady()
	{
		ball.reset();
		window.requestAnimationFrame(update);
		if (buttonReady)
			buttonReady.style.display = "none";
	}

	function updatePositions()
	{
		/*server*/ ball.setPosition(moveBall(deltaTime, ball, p_paddle, o_paddle));

		/*client: get positions from server and apply them (ball and opponent's paddle)*/
		GOAL = (ball.pos.x >= 99.9 || ball.pos.x <= 0.1)
		console.log(ball.pos.x);
		if (GOAL)
			GOOOAAAAAAL(ball);
	}

	function GOOOAAAAAAL(ball: Ball)
	{
		if (p_score && ball.pos.x > 50)
		{
			player.score++;
			p_score.textContent = player.score;
		}
		else if (o_score)
		{
			opponent.score++;
			o_score.textContent = opponent.score;
		}
		ball.reset();
	}

	function update(time : number)
	{
		if (prevTime != 0 && ball)
		{
			deltaTime = time - prevTime;
			updatePositions();
		}
		prevTime = time;
		window.requestAnimationFrame(update);
		console.log(ball.pos.x);
	}

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
