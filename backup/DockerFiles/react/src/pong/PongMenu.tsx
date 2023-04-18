import './styles.css'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import { socketManager } from '../Pages/HomePage'
import { SetParamsToGetPost } from "../Headers/HeaderManager"
import Pong from './Pong'

export default function PongMenu ()
{
	const gameList = document.getElementById('gameList');
	let games = new Array<String>;
	let gameToSpec: number;
	const navigate = useNavigate();
	let socket = socketManager.getPongSocket();
	let test: boolean = false;

	if (gameList)
		gameList.style.display = "none";

	async function onClickPlayClassic()
	{	
		while  (!socket)
		{
			console.log("init socket");
    			if (test === false && SetParamsToGetPost().headers.Authorization !== null)
			{
      				socket = socketManager.initializePongSocket(SetParamsToGetPost().headers.Authorization)
      				console.log(socket)
				if (socket)
      					test = true;
    			}
		}
		console.log("emitting");
		socket.emit('joinQueue');
		navigate('/pong/play');
	}
	
	async function onClickPlayVariant()
	{
	}
	
	/*async function onClickSpectate()
	{	
		const response = await axios.post('/pong/getGames');
		games = response.data;
		if (gameList)
			gameList.style.display = "flex";
	}
	
	async function onClickGame(index: number)
	{
		socket.emit('joinSpectate', index);
		navigate('/pong/spectate');
	}

	return (
		<div className="pong menu">
			<h1>PONG</h1>
			<button className="launch classic" onClick={onClickPlayClassic}>play classic</button>
			<button className="launch variant" onClick={onClickPlayVariant}>play variant</button>
			<button className="launch spectate" onClick={onClickSpectate}>spectate</button>
			<div className="menu gameList" id="gameList">
				<ul>
					{ games.map((game, index) => (
						<li key={index} onClick={() => { onClickGame(index) }}>{game}</li>
					))}
				</ul>
			</div>
		</div>
	);*/

	return (
		<div className="pong menu">
			<h1>PONG</h1>
			<button className="launch classic" onClick={onClickPlayClassic}>play classic</button>
			<button className="launch variant" onClick={onClickPlayVariant}>play variant</button>
		</div>
	);
}
