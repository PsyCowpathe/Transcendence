import "./styles.css";
import React from "react";
import { useState, useEffect, useRef, Ref } from "react";

import Player from "./Player"
import Ball from "./Ball";
import Paddle from "./Paddle";
import moveBall from "./MoveBall";

export default function Pong ()
{
	const BASE_SPEED = 0.05;
	const GAME_SPEED = 1.001;

	let buttonReady: HTMLElement | null;
	let bounds = {};
	let deltaTime: number = 0;
	let prevTime: number = 0;
	let ball: Ball;
	let p_paddle!: Paddle;
	let o_paddle!: Paddle;
	let player1!: Player;
	let player2!: Player;
	let GOAL: string | null = null; 

	const createBall = () =>
	{
		ball = new Ball(document.getElementById("ball"));
		ball.dir = ball.getRandomDirection();
	//	ball.dir.y = 0;
	//	ball.dir.x = 1;
	}
	const createPaddles = () =>
	{
		p_paddle = new Paddle(document.getElementById("p_paddle"));
		o_paddle = new Paddle(document.getElementById("o_paddle"));
	}
	const createBounds = () =>
	{
		const up: HTMLElement | null = document.getElementById("upperbound");
		const down: HTMLElement | null = document.getElementById("lowerbound");
		if (up && down)
			bounds = { up: up.getBoundingClientRect(), down: down.getBoundingClientRect() }
	}
	const createPlayers = () =>
	{
		player1 = new Player("name", p_paddle);
		player2 = new Player("name", o_paddle);	
	}

	useEffect(() => {
		createBall();
		createPaddles();
		createBounds();
		createPlayers();
		buttonReady = document.getElementById("player_ready");
		document.addEventListener("mousemove", e => {
			p_paddle.setPosition(100 * e.y / window.innerHeight);
		});
	}, []);

	function playerReady()
	{
		window.requestAnimationFrame(update);
		ball.speed = BASE_SPEED;
		if (buttonReady)
			buttonReady.style.display = "none";
	}

	function GOOOAAAAAAL(ball: Ball)
	{
		if (ball.pos.x > 50)
			player1.score++;
		else
			player2.score++;
		ball.reset();
		if (buttonReady)
			buttonReady.style.display = "block";
	}

	function update(time : number)
	{
		if (prevTime != 0 && ball)
		{
			deltaTime = time - prevTime;
			//movePaddles();
			GOAL = moveBall(deltaTime, ball, bounds, p_paddle, o_paddle);
			if (GOAL)
				GOOOAAAAAAL(ball);
			console.log("SDLKF : " + p_paddle.pos_y);
		}
		prevTime = time;
		window.requestAnimationFrame(update);
	}

	return (
			<div style={{height:"100vh"}} className="pong_body">
			<h1>PONG</h1>
			<button className="player_ready" onClick={playerReady} id="player_ready">READY</button>
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
