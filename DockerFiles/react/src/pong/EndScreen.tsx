import "./styles.css"
import React from "react"
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef, Ref } from "react"

export default function EndScreen()
{
	const navigate = useNavigate();

	let message: HTMLElement | null;
	let player_left: HTMLElement | null;
	const params = new URLSearchParams(window.location.search);
	const result = params.get('result');
	const forfeit = params.get('forfeit');

	useEffect(() =>
	{
		message = document.getElementById("result");
		player_left = document.getElementById("player_left");
		if (message && result == "victory")
		{
			message.style.color = 'green';
			message.textContent = "VICTORY";
			if (forfeit && player_left)
			{
				player_left.textContent = '(your opponent left)';
				player_left.style.color = 'green';
				player_left.style.display = "flex";
			}
		}
		else if (message && result == "defeat")
		{
			message.style.color = 'red';
			message.textContent = "DEFEAT";
			if (forfeit && player_left)
			{
				player_left.textContent = '(you just left the game)';
				player_left.style.color = 'red';
				player_left.style.display = "flex";
			}
		}
		else if (message)
		{
			message.style.color = 'yellow';
			message.textContent = "dude, get a life";
		}
	}, []);

	function buttonHandler()
	{
		navigate('/pong/menu');
	}

	return (<div className="pong endscreen">
			<div className="result" id="result">asdf</div>
			<div className="player_left" id="player_left"></div>
			<div className="redirect">click this button and you will be redirected to the menu</div>
			<button className="back_to_menu" onClick={buttonHandler}>click me</button>
		</div>
	);
}
