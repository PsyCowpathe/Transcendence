import { NestFactory } from '@nestjs/core' 
import { IoAdapter } from '@nestjs/platform-socket.io'
import { AppModule } from './../../../app.module'

import Player from "./Player"
import Ball from "./Ball";
import Paddle from "./Paddle";

export default class Game 
{
	TIME_OVER: number = 180000;

	p1: Player;
	p2: Player;
	tag: number;
	startTime:number = 0;
	elapsedTime: number = 0;
	prevTime: number = 0;
	deltaTime: number = 0;
	lastSpellTime: number = 0;
	ball = new Ball();
	p1_paddle = new Paddle(3);
	p2_paddle = new Paddle(96);
	p1_ready: boolean = false;
	p2_ready: boolean = false;
	variantProposed: boolean = false;
	p1_variant: boolean = false;
	p2_variant: boolean = false;
	GOAL:boolean = false;
	variant: boolean = false;
	playing: boolean = false;
	spellInUse1: boolean = false;
	spellInUse2: boolean = false;
	timeisover:boolean = false;
	winner: number = 0;
	isFinished: boolean = false;

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
	
		if (ballrect.up <= 0.75)
			this.ball.dir.y = Math.abs(this.ball.dir.y);
		else if (ballrect.down >= 59.15)
			this.ball.dir.y = -Math.abs(this.ball.dir.y);
		
		if (this.ball.pos.x < 15)
		{
			const p1_paddlerect = this.p1_paddle.getRect();
			
			if (	ballrect.left <= 3.7 && this.ball.pos.x >= p1_paddlerect.left &&
				((ballrect.up <= p1_paddlerect.down &&
				ballrect.down >= p1_paddlerect.up) ||
				(this.spellInUse1))	)
				{
				let rad:number = ((this.ball.pos.y - this.p1_paddle.pos.y) / (2 * this.p1_paddle.size));	
				newdir = {	x: Math.cos(rad * Math.PI),
						y: Math.sin(rad * Math.PI)	};
				this.ball.setDirection(newdir);
				this.ball.speed = this.ball.GAME_SPEED + (Number(this.variant) * (0.000000185 * this.elapsedTime));
			}
		}
		else if (this.ball.pos.x > 85)
		{
			const p2_paddlerect = this.p2_paddle.getRect();
			
			if (	ballrect.right >= 96.3 && this.ball.pos.x <= p2_paddlerect.right &&
				((ballrect.up <= p2_paddlerect.down &&
				ballrect.down >= p2_paddlerect.up) ||
				(this.spellInUse2))	)
			{
				let rad:number = ((this.ball.pos.y - this.p2_paddle.pos.y) / (2 * this.p2_paddle.size));
				newdir = {	x: -Math.cos(rad * Math.PI),
						y: Math.sin(rad * Math.PI)	};
				this.ball.setDirection(newdir);
				this.ball.speed = this.ball.GAME_SPEED + (Number(this.variant) * (0.000000185 * this.elapsedTime));
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
		this.ball.reset();
	}

	useSpell(player: number)
	{
		if (player == 1 && !this.spellInUse1 && this.p1.spellsUsed < 3)
		{
			this.spellInUse1 = true;
			this.p1_paddle.size = 60;
			this.p1_paddle.pos.y = 50;
			setTimeout(() => {
  				this.p1_paddle.size = 10;
				this.p1.spellsUsed++;
				this.spellInUse1 = false;
			}, 420);
		}
		else if (player == 2 && !this.spellInUse2 && this.p2.spellsUsed < 3)
		{
			this.spellInUse2 = true;
			this.p2_paddle.size = 60;
			this.p2_paddle.pos.y = 50;
			setTimeout(() => {
  				this.p2_paddle.size = 10;
				this.p2.spellsUsed++;
				this.spellInUse2 = false;
			}, 420);
		}
	}

	start()
	{
		this.playing = true;
		this.startTime = Date.now()
		this.prevTime = this.startTime;
		this.update();
	}

	update = () =>
	{
		const time = Date.now();
		this.deltaTime = time - this.prevTime;
		this.prevTime = time;
		this.elapsedTime = time - this.startTime;
		if (this.variant)
		{
			if (!this.spellInUse1)
				this.p1_paddle.shrink(0.0000755287);
			if (!this.spellInUse2)
				this.p2_paddle.shrink(0.0000755287);
		}
		this.moveBall();
		if (this.ball.pos.x >= 99.9 || this.ball.pos.x <= 0.1)
			this.GOOOAAAAAAL();
		if (this.elapsedTime > this.TIME_OVER) 
			this.timeisover = true;
		if (this.timeisover || this.p1.score == 11 || this.p2.score == 11)
		{
			if (this.p1.score > this.p2.score)
				this.winner = 1;
			else if (this.p2.score > this.p1.score)
				this.winner = 2;
			else
				this.winner = 3;
		}
		setTimeout(this.update, 2);
	};

	getGameState()
	{
		return ({
				ballpos: this.ball.pos,
				p1_paddle_pos: this.p1_paddle.pos.y,
				p2_paddle_pos: this.p2_paddle.pos.y,
				p1_paddle_size: this.p1_paddle.size,
				p2_paddle_size: this.p2_paddle.size,
				p1_score: this.p1.score,
				p2_score: this.p2.score,
			});
	}
}
