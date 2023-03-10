import React from "react";
import { useState, useEffect, useRef, Ref } from "react";

import Ball from "./Ball";
import Paddle from "./Paddle";
import moveBall from "./MoveBall";

export default class Player
{
	paddle!: Paddle;
	score: number = 0;
	name: string = "";

	constructor(name: string, paddle: Paddle)
	{
		this.name = name;
	}
}
