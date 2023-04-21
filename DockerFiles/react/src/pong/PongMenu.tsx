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

	return (
		<div className="pong menu">
			<h1>PONG</h1>
			<button className="launch classic" onClick={onClickPlayClassic}>play classic</button>
			<button className="launch variant" onClick={onClickPlayVariant}>play variant</button>
		</div>
	);

}
