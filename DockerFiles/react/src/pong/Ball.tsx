import React from 'react';
import { useState, useRef, forwardRef, Ref } from "react";

export default class Ball
{
	ball!: HTMLElement;
	pos = { x: 0, y: 0 };
	dir = { x: 0, y: 0 };
	speed: number = 0;

	constructor (ball: HTMLElement | null)
	{
		if (ball)
			this.ball = ball;
		this.pos = { x: 50, y: 50 };
		this.dir = { x: 0, y: 0 };
		this.speed = 0;
	}

	getRandomDirection ()
	{
		let dir = { x: 0, y: 0 };
		while (!dir.x || dir.y < -0.8 && dir.y > 0.8)
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

	rect()
	{
		return (this.ball.getBoundingClientRect());
	}

	setPosition (x: any, y: any)
	{
		if (x > -1 && x < 101)
		{
			this.pos.x = x;
			this.ball.style.setProperty("--x", x);
		}
		if (y > -1 && y < 101)
		{
			this.pos.y = y;
			this.ball.style.setProperty("--y", y);
		}
	}

	setDirection (x: number, y: number)
	{
		this.dir.x = x;
		this.dir.y = y;
	}

	reset()
	{
		this.setPosition(50, 50);
		this.dir = this.getRandomDirection();
		this.speed = 0;
	}
}

