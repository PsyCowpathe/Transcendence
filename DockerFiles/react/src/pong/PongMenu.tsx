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

	let [invitesReceived, setInvitesReceived] = useState<Invite[]>([]);
	let [invitesSent, setInvitesSent] = useState<Invite[]>([]);

	useEffect(() =>
	{
		try
		{

		socket.on('refreshInvites', () =>
		{
			socket.emit('getInvites');
		});

		socket.on('invitesList', (invitesReceived: any, invitesSent: any) =>
		{
			setInvitesReceived(invitesReceived.map((elem: { name: string, uid: number}) => 
			{
				return ({ name: elem.name, uid: elem.uid });
			}));
			setInvitesSent(invitesSent.map((elem: { name: string, uid: number}) => 
			{
				return ({ name: elem.name, uid: elem.uid });
			}));
		});

		socket.on('duelInviteReceived', (opponent: string) =>
		{
			socket.emit('getInvites');
		});

		socket.on('duelInviteCanceled', (opponent: string) =>
		{
			socket.emit('getInvites');
		});

		socket.on('duelInviteAnswered', (opp_name: string, accepted: boolean) =>
		{
			if (accepted)
			{
				console.log(opp_name + " accepted your duel invitation");
			}
			else
			{
				console.log(opp_name + " declined your duel invitation");
			}
			socket.emit('getInvites');
		});

		socket.on('joinDuel', () =>
		{
				navigate('/pong/play');
		});

		socket.on('GameError', (response: any) =>
		{
			console.log(response);
		});

		socket.emit('getInvites');
		
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
			socket.emit('answerDuel', { id1: myUid, id2: uid, inviteAccepted: true });

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
			socket.emit('answerDuel', { id1: myUid, id2: uid, inviteAccepted: false });

		}
		catch(error)
		{
			console.log("i'm a teapot");
		}
	}

	function cancelInvite(uid: number)
	{
		try
		{

		if (uid && myUid)
			socket.emit('cancelInvite', { input: uid });

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
			<div className="invitesReceived">
				<div className="invitesTitle">Received :</div>
				<ul>
					{invitesReceived.map((elem: {name: string, uid: number}, index: number) => (
						<li key={index}>
							duel invitation from: {elem.name}
							<button className="acceptDuel" onClick={() => { acceptDuel(elem.uid) }}></button>
							<button className="declineDuel" onClick={() => { declineDuel(elem.uid) }}></button>
						</li>
					))}
				</ul>
			</div>
			<div className="invitesSent">
				<div className="invitesTitle">Sent :</div>
				<ul>
					{invitesSent.map((elem: {name: string, uid: number}, index: number) => (
						<li key={index}>
							invitation sent to: {elem.name}
							<button className="cancelDuelInvite" onClick={() => { cancelInvite(elem.uid) }}></button>
						</li>
					))}
				</ul>
			</div>
		</div>
	);

}
