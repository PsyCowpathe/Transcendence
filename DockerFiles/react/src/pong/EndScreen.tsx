import "./pong_menu.css"
import React from "react"
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef, Ref } from "react"

export default function EndScreen()
{
	const navigate = useNavigate();

	let title: HTMLElement | null;
	let ps: HTMLElement | null;
	const params = new URLSearchParams(window.location.search);
	const result = params.get('result');
	const forfeit = params.get('forfeit');
	const flagged = params.get('flagged');

	useEffect(() =>
	{
		title = document.getElementById("result");
		ps = document.getElementById("ps");
		if (title && result == "victory")
		{
			title.style.color = 'green';
			title.textContent = "VICTORY";
			if (forfeit && ps)
			{
				ps.style.color = 'green';
				ps.textContent = '(your opponent left)';
				ps.style.display = "flex";
			}
			else if (flagged && ps)
			{
				ps.style.color = 'green';
				ps.textContent = '(your opponent lost on time)';
				ps.style.display = "flex";
			}
		}
		else if (title && result == "defeat")
		{
			title.style.color = 'red';
			title.textContent = "DEFEAT";
			if (forfeit && ps)
			{
				ps.style.color = 'red';
				ps.textContent = '(you just left the game)';
				ps.style.display = "flex";
			}
			else if (flagged && ps)
			{
				ps.style.color = 'red';
				ps.textContent = '(you lost on time)';
				ps.style.display = "flex";
			}
		}
		else if (title && ps && result == "draw")
		{
			title.style.color = 'yellow';
			title.textContent = "DRAW";
			ps.textContent = '(time is up)';
			ps.style.color = 'yellow';
			ps.style.display = "flex";
		}
		else if (title)
		{
			title.style.color = 'yellow';
			title.textContent = "dude, get a life";
		}
	}, []);

	function buttonHandler()
	{
		navigate('/pong/menu');
	}

	return (<div className="pong endscreen">
			<div className="result" id="result">asdf</div>
			<div className="ps" id="ps"></div>
			<div className="redirect">click this button and you will be redirected to the menu</div>
			<button className="back_to_menu" onClick={buttonHandler}>click me</button>
		</div>
	);
}
