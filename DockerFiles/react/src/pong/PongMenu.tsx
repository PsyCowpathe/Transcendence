import './pong_menu.css'
import React from 'react'
import { useEffect } from 'react'
import { useNavigate, } from 'react-router-dom'
import axios from 'axios'

import socketManager from '../MesSockets'
import { SetParamsToGetPost } from '../Headers/HeaderManager'
import Pong from './Pong'

export default function PongMenu ()
{
	const navigate = useNavigate();
	let myUid: number = parseInt(window.localStorage.getItem("UID"));

	let socket = socketManager.getPongSocket();
	while (!socket)
	{
		try
		{

		const token = SetParamsToGetPost().headers.Authorization;
		if (token !== null)
		{
			socketManager.initializePongSocket(token);
			socket = socketManager.getPongSocket();
		}

		}
		catch(error)
		{
			console.log("i'm a teapot");
		}
	}

	let invites = new Map<string, number>();

	useEffect(() => {
		try
		{

		socket.emit('getInvites');
		socket.on('invitesList', (invitesList: Map<string, number>, uid: number) =>
		{
			invites = invitesList;
		});
		socket.on('duelInviteReceived', () =>
		{
			socket.emit('getInvites');
		});
		socket.on('duelInviteAnswered', (opp_name: string, accepted: boolean) =>
		{
			if (accepted)
				console.log(opp_name + " accepted your duel invitation");
			else
				console.log(opp_name + " rejected your duel invitation");
		});
		socket.on('GameError', (response: any) =>
		{
			console.log(response);
		});

		}
		catch(error)
		{
			console.log("i'm a teapot");
		}
	}, []);

	function acceptDuel(uid: number | undefined)
	{
		try
		{


		if (uid)
			socket.emit('answerDuel', myUid, uid, true);

		}
		catch(error)
		{
			console.log("i'm a teapot");
		}
	}

	function rejectDuel(uid: number | undefined)
	{
		try
		{


		if (uid)
		{
			socket.emit('answerDuel', myUid, uid, true);
		}

		}
		catch(error)
		{
			console.log("i'm a teapot");
		}
	}

	function onClickPlay()
	{	
		try
		{


		navigate('/pong/play');

		}
		catch(error)
		{
			console.log("i'm a teapot");
		}
	}

	return (
		<div className="pong menu">
			<div className="h1nº2">PONG</div>
			<button className="play" onClick={onClickPlay}>play</button>
			<div className="duelInvites">
				<div className="invitesTitle">Invitations :</div>
				<ul>
					{Array.from(invites.keys()).map((item: string, index: number) => (
						<li key={index}>
							duel invite from: {item}
							<button className="acceptDuel" onClick={() => { acceptDuel(invites.get(item)) }}></button>
							<button className="rejectDuel" onClick={() => { rejectDuel(invites.get(item)) }}></button>
						</li>
					))}
				</ul>
			</div>
		</div>
	);

}
