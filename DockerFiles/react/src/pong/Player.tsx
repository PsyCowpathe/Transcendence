import React from "react";
import { useState, useEffect, useRef, Ref } from "react";

import Ball from "./Ball";
import Paddle from "./Paddle";

export default class Player
{
	paddle!: Paddle;
	name:string | null = "";
	score:number = 0;

	constructor(name: string | null)
	{
		this.name = name;
	}
}
