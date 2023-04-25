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

	return (
		<div className="pong menu">
			<div className="h1 nº1">PONG</div>
			<button className="launch classic" onClick={onClickPlayClassic}>play classic</button>
		</div>
	);

}
