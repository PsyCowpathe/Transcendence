import React from 'react';
import { useState, useRef, forwardRef } from "react";

import Ball from "./Ball"
import Paddle from "./Paddle"
import Pong from "./Pong"

export default function moveBall(deltaTime: number, ball: Ball, p_paddle: Paddle, o_paddle: Paddle)
{
	let ballrect = ball.getRect();
	const p_paddlerect = p_paddle.getRect();
	const o_paddlerect = o_paddle.getRect();

	if (ballrect.up <= 20 || ballrect.down >= 80)
		ball.dir.y *= -1;
	
	if (	ballrect.left <= p_paddlerect.right &&
		ballrect.up <= p_paddlerect.down &&
		ballrect.down >= p_paddlerect.up)
	{
		ball.dir.x *= -1;
	}
	else if (true)
	{

	}
	if (ballrect.right >= o_paddlerect.left &&
		ballrect.up <= o_paddlerect.down &&
		ballrect.down >= o_paddlerect.up)
	{
		ball.dir.x *= -1;
	}
	else if (true)
	{

	}
	
	if (ball.pos.x >= 100 || ball.pos.x <= 0)
		return ("GOAL");

	const pos = {	x: ball.pos.x + (ball.dir.x * ball.speed * deltaTime),
			y: ball.pos.y + (ball.dir.y * ball.speed * deltaTime)	};
	ball.setPosition(pos.x, pos.y);
	
	return (null);	
}


