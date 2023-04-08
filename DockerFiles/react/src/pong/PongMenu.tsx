import './styles.css'
import React from 'react'
import { Link } from 'react-router-dom'
import Pong from './Pong'

export default function PongMenu ()
{
	function onClickPlayClassic()
	{
	}
	
	function onClickPlayVariant()
	{
	}
	
	function onClickSpectate()
	{
	}

	return (
		<div className="pong menu">
			<h1>PONG</h1>
			<button className="launch classic" onClick={onClickPlayClassic}>play classic</button>
			<Link to="/pong/play">asdf</Link>
			<button className="launch variant" onClick={onClickPlayVariant}>play variant</button>
			<button className="launch spectate" onClick={onClickSpectate}>spectate</button>
		</div>
	);
}
