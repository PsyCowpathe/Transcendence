import './pong_menu.css'
import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, } from 'react-router-dom'
import axios from 'axios'
import {TopBar} from '../Pages/NavBar'
import socketManager from '../MesSockets'
import { SetParamsToGetPost } from '../Headers/HeaderManager'
import Pong from './Pong'

interface Invite
{
	name: string;
	uid: number;
}

export default function PongMenu ()
{
	const navigate = useNavigate();
	let myUid: any = window.localStorage.getItem("UID");
	if (myUid)
		myUid = parseInt(myUid);

	let socket = socketManager.getPongSocket();
	//let socket: any = null;
	useEffect(() =>
	{
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
	}, []);

	let [invites, setInvites] = useState<Invite[]>([]);

	useEffect(() => {
		try
		{

		socket.emit('getInvites');
		socket.on('invitesList', (invitesList: any) =>
		{
			setInvites(invitesList.map((elem: { name: string, uid: number}) => 
			{
				return ({ name: elem.name, uid: elem.uid });
			}));
			for (const data of invites)
			{
				console.log(data.name);
				console.log(data.uid);
			}
		});
		socket.on('duelInviteReceived', () =>
		{
			socket.emit('getInvites');
		});
		socket.on('duelInviteAnswered', (opp_name: string, accepted: boolean) =>
		{
			if (accepted)
			{
				console.log(opp_name + " accepted your duel invitation");
				socket.emit('getInvites');
				navigate('/pong/play');
			}
			else
			{
				console.log(opp_name + " declined your duel invitation");
				socket.emit('getInvites');
			}
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

		if (uid && myUid)
		{
			socket.emit('answerDuel', { id1: myUid, id2: uid, inviteAccepted: true });
			navigate('/pong/play');
		}

		}
		catch(error)
		{
			console.log("i'm a teapot");
		}
	}

	function declineDuel(uid: number | undefined)
	{
		try
		{

		if (uid && myUid)
		{
			socket.emit('answerDuel', { id1: myUid, id2: uid, inviteAccepted: false });
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
		<div className="pong menue">
	<TopBar />
			<div className="h1nº2">PONG</div>
			<button className="play" onClick={onClickPlay}>play</button>
			<div className="duelInvites">
				<div className="invitesTitle">Invitations :</div>
				<ul>
					{invites.map((elem: {name: string, uid: number}, index: number) => (
						<li key={index}>
							duel invite from: {elem.name}
							<button className="acceptDuel" onClick={() => { acceptDuel(elem.uid) }}></button>
							<button className="declineDuel" onClick={() => { declineDuel(elem.uid) }}></button>
						</li>
					))}
				</ul>
			</div>
		</div>
	);

}
