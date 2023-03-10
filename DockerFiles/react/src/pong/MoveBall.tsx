import React from 'react';
import { useState, useRef, forwardRef } from "react";

import Ball from "./Ball"
import Paddle from "./Paddle"
import Pong from "./Pong"

export default function moveBall(deltaTime: number, ball: Ball, bounds: any, p_paddle: Paddle, o_paddle: Paddle)
{
	let ballrect = ball.rect();
	const p_paddlerect = p_paddle.rect();
	const o_paddlerect = o_paddle.rect();

	if (ballrect.bottom >= bounds.down.top || ballrect.top <= bounds.up.bottom)
		ball.dir.y *= -1;
/*	else if (ballrect.right >= o_paddlerect.left && ballrect.top >= o_paddlerect.top && ballrect.bottom <= o_paddlerect.bottom)
	{
		ball.dir.x *= -1;
		//if (ball.pos.y > o_paddlerect.pos_y)
		//{
		//}
	}*/
//	else if (ballrect.right >= o_paddlerect.left && ballrect.top <= o_paddlerect.bottom)
	
	const pos = { x: ball.pos.x + (ball.dir.x * ball.speed * deltaTime),
			   y: ball.pos.y + (ball.dir.y * ball.speed * deltaTime) };
	ball.setPosition(pos.x, pos.y);
	if (ball.pos.x >= 100 || ball.pos.x <= 0)
		return ("GOAL");
	else
		return (null);
};


