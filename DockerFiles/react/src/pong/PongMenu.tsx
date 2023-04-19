import './styles.css'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import Pong from './Pong'

export default function PongMenu ()
{
	const navigate = useNavigate();


	async function onClickPlayClassic()
	{	
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
		socket.emit('joinVariantQueue');
		navigate('/pong/play/variant');
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
