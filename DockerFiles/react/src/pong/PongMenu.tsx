import './styles.css'
import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

import socketManager from '../Pages/HomePage'
import Pong from './Pong'

export default function PongMenu ()
{
	const gameList = document.getElementById('gameList');
	let games = new Array<String>;
	let gameToSpec: number;

	if (gameList)
		gameList.style.display = "none";

	async function onClickPlayClassic()
	{	
		const response = await axios.post('/joinQueue', {
					uid: window.localStorage.getItem("UID")
					});
		window.location.assign('/pong/play');
	}
	
	async function onClickPlayVariant()
	{
	/*	const response = await axios.post('/joinQueueVariant', {
					uid: window.localStorage.getItem("UID")
					});
		window.location.assign('/pong/play/variant');*/
	}
	
	async function onClickSpectate()
	{	
		const response = await axios.post('/getGames');
		games = response.data;
		if (gameList)
			gameList.style.display = "flex";
	}
	
	async function onClickGame(index: number)
	{
		const response = await axios.post('/spectateGame', {
					uid: window.localStorage.getItem("UID"),
					gameToSpec: index
					});
		window.location.assign('/pong/spectate');
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
	);
}
