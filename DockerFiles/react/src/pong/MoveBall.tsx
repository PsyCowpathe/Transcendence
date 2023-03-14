import React from 'react';
import { useState, useRef, forwardRef } from "react";

import Ball from "./Ball"
import Paddle from "./Paddle"
import Pong from "./Pong"

export default function moveBall(deltaTime: number, ball: Ball, p_paddle: Paddle, o_paddle: Paddle)
{
	let ballrect = ball.getRect();
	let newdir = { x: 0, y: 0};
	let newpos = { x: 0, y: 0};

	if (ballrect.up <= 20)
		ball.dir.y = Math.abs(ball.dir.y);
	else if (ballrect.down >= 80)
		ball.dir.y = -Math.abs(ball.dir.y);
	
	if (ball.pos.x < 10 && ball.headingThere)
	{
		const p_paddlerect = p_paddle.getRect();
		
		if (	ballrect.left <= p_paddlerect.right &&
			ballrect.up <= p_paddlerect.down &&
			ballrect.down >= p_paddlerect.up &&
			ball.pos.x >= p_paddlerect.left	)
		{
			let rad:number = ((ball.pos.y - p_paddle.pos.y) / 10);
			if (rad > 0.1)
				rad -= 0.1;
			else if (rad < 0.1)
				rad += 0.1;
			newdir = {	x: Math.cos(rad * Math.PI),
					y: Math.sin(rad * Math.PI)	};
			ball.setDirection(newdir);
			ball.headingThere = false;
		}
	}
	else if (ball.pos.x > 90 && !ball.headingThere)
	{
		const o_paddlerect = o_paddle.getRect();
		
		if (	ballrect.right >= o_paddlerect.left &&
			ballrect.up <= o_paddlerect.down &&
			ballrect.down >= o_paddlerect.up &&
			ball.pos.x <= o_paddlerect.right	)
		{
			let rad:number = ((ball.pos.y - o_paddle.pos.y) / 10);
			if (rad > 0.1)
				rad -= 0.1;
			else if (rad < 0.1)
				rad += 0.1;
			newdir = {	x: -Math.cos(rad * Math.PI),
					y: Math.sin(rad * Math.PI)	};
			ball.setDirection(newdir);
			ball.headingThere = true;
		}
	}

	newpos = {	x: ball.pos.x + (ball.dir.x * ball.speed * deltaTime),
			y: ball.pos.y + (ball.dir.y * ball.speed * deltaTime)	};
	
	return (newpos);
}


