import React from "react";
import { useState, useEffect, useRef, Ref } from "react";

import Ball from "./Ball";
import Paddle from "./Paddle";

export default class Player
{
	paddle!: Paddle;
	name:string = "";
	score:number = 0;
	id: number = 0;

	constructor(name: string)
	{
		this.name = name;
	}
}
