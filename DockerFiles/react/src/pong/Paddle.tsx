import React from 'react';
import { useState, useRef, forwardRef, Ref } from "react";

export default class Paddle
{
	paddle!: HTMLElement;
	pos_y = 0;
	speed: number = 0;

	constructor(paddle: HTMLElement | null)
	{
		if (paddle)
			this.paddle = paddle;
		this.pos_y = 50;
	}

	rect()
	{
		return (this.paddle.getBoundingClientRect());
	}

	setPosition(y: any)
	{
		if (y > 20 && y < 80)
		{
			this.pos_y = y;
			this.paddle.style.setProperty("--pos", y);
		}
		
	}
}
