import { NestFactory } from '@nestjs/core' 
import { IoAdapter } from '@nestjs/platform-socket.io'
import { AppModule } from './../app.module'

import Player from "./Player"
import Ball from "./Ball";
import Paddle from "./Paddle";


export default function PongGame (p1_name: string, p2_name: string)
{
	let deltaTime: number = 0;
	let prevTime: number = 0;
	let ball = Ball();
	let p1_paddle = Paddle(3);
	let p2_paddle = Paddle(96);
	let p1 = Player(p1_name);
	let p1 = Player(p2_name);
	let GOAL:boolean = false;

	ball.reset();

	function moveBall()
	{
		let ballrect = ball.getRect();
		let p1_paddlerect = p1_paddle.getRect();
		let newdir = { x: 0, y: 0};
		let newpos = { x: 0, y: 0};
	
		if (ballrect.up <= 20)
			ball.dir.y = Math.abs(ball.dir.y);
		else if (ballrect.down >= 80)
			ball.dir.y = -Math.abs(ball.dir.y);
		
		if (ball.pos.x < 15)
		{
			const p_paddlerect = p_paddle.getRect();
			
			if (	ballrect.left <= p_paddlerect.right &&
				ballrect.up <= p_paddlerect.down &&
				ballrect.down >= p_paddlerect.up &&
				ball.pos.x >= p_paddlerect.left	)
				{
				let rad:number = ((ball.pos.y - p_paddle.pos.y) / 20);	
				newdir = {	x: Math.cos(rad * Math.PI),
						y: Math.sin(rad * Math.PI)	};
				ball.setDirection(newdir);
				ball.speed = ball.GAME_SPEED;
			}
		}
		else if (ball.pos.x > 75)
		{
			const o_paddlerect = o_paddle.getRect();
			
			if (	ballrect.right >= o_paddlerect.left &&
				ballrect.up <= o_paddlerect.down &&
				ballrect.down >= o_paddlerect.up &&
				ball.pos.x <= o_paddlerect.right	)
			{
				let rad:number = ((ball.pos.y - o_paddle.pos.y) / 20);
				newdir = {	x: -Math.cos(rad * Math.PI),
						y: Math.sin(rad * Math.PI)	};
				ball.setDirection(newdir);
				ball.speed = ball.GAME_SPEED;
				ball.wasHit = true;
			}
		}
	
		newpos = {	x: ball.pos.x + (ball.dir.x * ball.speed * deltaTime),
				y: ball.pos.y + (ball.dir.y * ball.speed * deltaTime)	};
		
		ball.setPosition(newpos);
	}

	function GOOOAAAAAAL()
	{
		if (ball.pos.x > 50)
			p1.score++;
		else
			p2.score++;
		GOAL = true;
		ball.reset();
	}

	function update(time : number)
	{
		if (prevTime)
		{
			deltaTime = time - prevTime;
			moveBall();
			if (ball.pos.x >= 99.9 || ball.pos.x <= 0.1)
				GOOOAAAAAAL(ball);
		}
		prevTime = time;
	}

	function getGameState()
	{
		return ({
				ballpos: ball.pos,
				p1_paddlepos: p1_paddle.pos,
				p2_paddlepos: p2_paddle.pos
			});
	}
}
