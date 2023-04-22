import { NestFactory } from '@nestjs/core' 
import { IoAdapter } from '@nestjs/platform-socket.io'
import { AppModule } from './../../../app.module'

import Player from "./Player"
import Ball from "./Ball";
import Paddle from "./Paddle";

export default class Game 
{
	p1: Player;
	p2: Player;
	tag: number;
	startTime:number = 0;
	prevTime: number = 0;
	deltaTime: number = 0;
	ball = new Ball();
	p1_paddle = new Paddle(3);
	p2_paddle = new Paddle(96);
	bot_paddle = new Paddle(49);
	p1_ready: boolean = false;
	p2_ready: boolean = false;
	GOAL:boolean = false;
	timeover:boolean = false;

	constructor(p1: Player, p2: Player, tag: number)
	{
		this.p1 = p1;
		this.p2 = p2;
		this.tag = tag;
		this.ball.reset();
	}

	moveBall()
	{
		let ballrect = this.ball.getRect();
		let newdir = { x: 0, y: 0};
		let newpos = { x: 0, y: 0};
	
		if (ballrect.up <= 20)
			this.ball.dir.y = Math.abs(this.ball.dir.y);
		else if (ballrect.down >= 80)
			this.ball.dir.y = -Math.abs(this.ball.dir.y);
		
		if (this.ball.pos.x < 15)
		{
			const p1_paddlerect = this.p1_paddle.getRect();
			
			if (	ballrect.left <= p1_paddlerect.right &&
				ballrect.up <= p1_paddlerect.down &&
				ballrect.down >= p1_paddlerect.up &&
				this.ball.pos.x >= p1_paddlerect.left	)
				{
				let rad:number = ((this.ball.pos.y - this.p1_paddle.pos.y) / 20);	
				newdir = {	x: Math.cos(rad * Math.PI),
						y: Math.sin(rad * Math.PI)	};
				this.ball.setDirection(newdir);
				this.ball.speed = this.ball.GAME_SPEED;
			}
		}
		else if (this.ball.pos.x > 85)
		{
			const p2_paddlerect = this.p2_paddle.getRect();
			
			if (	ballrect.right >= p2_paddlerect.left &&
				ballrect.up <= p2_paddlerect.down &&
				ballrect.down >= p2_paddlerect.up &&
				this.ball.pos.x <= p2_paddlerect.right	)
			{
				let rad:number = ((this.ball.pos.y - this.p2_paddle.pos.y) / 20);
				newdir = {	x: -Math.cos(rad * Math.PI),
						y: Math.sin(rad * Math.PI)	};
				this.ball.setDirection(newdir);
				this.ball.speed = this.ball.GAME_SPEED;
				this.ball.wasHit = true;
			}
		}

		newpos = {	x: this.ball.pos.x + (this.ball.dir.x * this.ball.speed * this.deltaTime),
				y: this.ball.pos.y + (this.ball.dir.y * this.ball.speed * this.deltaTime)	};
		
		this.ball.setPosition(newpos);
	}

	GOOOAAAAAAL()
	{
		if (this.ball.pos.x > 50)
			this.p1.score++;
		else
			this.p2.score++;
		this.GOAL = true;
		this.ball.reset();
	}

	update()
	{
		this.startTime = Date.now()
		this.prevTime = this.startTime;
    		setInterval(() =>
		{
			const time = Date.now();
			this.deltaTime = time - this.prevTime;
			this.prevTime = time;
			this.moveBall();
			if (this.ball.pos.x >= 99.9 || this.ball.pos.x <= 0.1)
				this.GOOOAAAAAAL();
			else if (time - this.startTime > 30000)
				this.timeover = true;
    		}, 1);
	}

	getGameState()
	{
		return ({
				ballpos: this.ball.pos,
				p1_paddlepos: this.p1_paddle.pos.y,
				p2_paddlepos: this.p2_paddle.pos.y,
				p1_score: this.p1.score,
				p2_score: this.p2.score,
			});
	}
}
