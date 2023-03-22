import React from 'react';
import { useState, useRef, forwardRef, Ref } from "react";

export default class Ball
{
	BASE_SPEED:number = 0.05;
	GAME_SPEED:number = 1.001;
	
	ball!: HTMLElement;
	pos = { x: 0, y: 0 };
	dir = { x: 0, y: 0 };
	rect = { right: 0, left: 0, up: 0, down: 0 };
	speed: number = 0;
	headingThere:boolean = true;

	constructor (ball: HTMLElement | null)
	{
		if (ball)
			this.ball = ball;
	}

	getRandomDirection ()
	{
		let dir = { x: 0, y: 0 };
		while (!dir.x || dir.y < -0.5 || dir.y > 0.5)
		{
			const rgn = Math.random() * 2 * Math.PI;
			dir = { x: Math.cos(rgn), y: Math.sin(rgn) };
		}
		return (dir);
	}

	getPosition ()
	{
		return (
				{ x: parseFloat(getComputedStyle(this.ball).getPropertyValue("--x")),
				  y: parseFloat(getComputedStyle(this.ball).getPropertyValue("--y")) }
			);
	}

	getRect()
	{
		this.rect = {	right: this.pos.x + 1, left: this.pos.x - 1,
				up: this.pos.y -1 , down: this.pos.y + 1	};
		return (this.rect);
	}

	setPosition (pos:{x:any, y:any})
	{
		if (pos.x > -1 && pos.x < 101)
		{
			this.pos.x = pos.x;
			this.ball.style.setProperty("--x", pos.x);
		}
		if (pos.y > -1 && pos.y < 101)
		{
			this.pos.y = pos.y;
			this.ball.style.setProperty("--y", pos.y);
		}
	}
	
	setDirection (dir:{x:any, y:any})
	{
		this.dir.x = dir.x;
		this.dir.y = dir.y;
	}

	reset()
	{
		const pos = { x: 50, y:50 };
		this.setPosition(pos);
		this.dir = this.getRandomDirection();
		this.headingThere = (this.dir.x < 0);
		this.rect = { right: 51, left: 49,
				up: 49, down: 51 };
		this.speed = this.BASE_SPEED;
	}
}

