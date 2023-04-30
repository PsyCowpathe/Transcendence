import React from 'react';
import { useState, useRef, forwardRef, Ref } from "react";

export default class Ball
{
	ball!: HTMLElement;
	pos = { x: 0, y: 0 };

	constructor (ball: HTMLElement | null)
	{
		if (ball)
			this.ball = ball;
		this.pos = {	x: parseFloat(getComputedStyle(this.ball).getPropertyValue("--x")),
				y: parseFloat(getComputedStyle(this.ball).getPropertyValue("--y")) };
	}

	setPosition (pos:{x:any, y:any})
	{
			this.ball.style.setProperty("--x", pos.x);
			this.ball.style.setProperty("--y", pos.y);
	}
}

