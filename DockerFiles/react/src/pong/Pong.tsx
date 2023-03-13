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
	let bounds = {};
	let deltaTime: number = 0;
	let prevTime: number = 0;
	let ball: Ball;
	let p_paddle!: Paddle;
	let o_paddle!: Paddle;
	let player1!: Player;
	let player2!: Player;
	let input: number; 
	let GOAL: string | null = null;

	const createBall = () =>
	{
		ball = new Ball(document.getElementById("ball"));
		ball.dir = ball.getRandomDirection();
	}
	const createPaddles = () =>
	{
		p_paddle = new Paddle(document.getElementById("p_paddle"));
		o_paddle = new Paddle(document.getElementById("o_paddle"));
	}
	const createPlayers = () =>
	{
		player1 = new Player("name", p_paddle);
		player2 = new Player("name", o_paddle);	
	}

	useEffect(() => {
		createBall();
		createPaddles();
		createPlayers();
		buttonReady = document.getElementById("player_ready");
		document.addEventListener("mousemove", eMouseMoved);
	}, []);
	
	function eMouseMoved(e: any)
	{
		input = e.y - input;
		p_paddle.setPosition(100 * e.y / window.innerHeight);
	}

	function playerReady()
	{
		window.requestAnimationFrame(update);
		if (buttonReady)
			buttonReady.style.display = "none";
	}

	function updatePositions(ballPos: any, )
	{
		
	}

	function GOOOAAAAAAL(ball: Ball)
	{
		if (ball.pos.x > 50)
			player1.score++;
		else
			player2.score++;
		ball.reset();
		p_paddle.reset();
		o_paddle.reset();
		if (buttonReady)
			buttonReady.style.display = "block";
	}

	function update(time : number)
	{
		if (prevTime != 0 && ball)
		{
			deltaTime = time - prevTime;
		
			GOAL = moveBall(deltaTime, ball, p_paddle, o_paddle);
			
		//	updatePositions();

			if (GOAL)
				GOOOAAAAAAL(ball);
		}
		prevTime = time;
		window.requestAnimationFrame(update);
	}

	return (
			<div style={{height:"100vh"}} className="pong_body">
			<h1>PONG</h1>
			<button className="player_ready" onClick={playerReady} id="player_ready"></button>
			<div className="score player" id="o_score">0</div>
			<div className="score opponent" id="o_score">0</div>
			<div className="ball" id="ball"></div>
			<div className="paddle left" id="p_paddle"></div>
			<div className="paddle right" id="o_paddle"></div>
			<div className="upperbound" id="upperbound"></div>
			<div className="central_line"></div>
			<div className="lowerbound" id="lowerbound"></div>
			</div>
		);
}
