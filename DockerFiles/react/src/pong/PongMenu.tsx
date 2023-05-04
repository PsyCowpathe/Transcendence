import './pong.menu.css'
import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, } from 'react-router-dom'
import axios from 'axios'
import {TopBar} from '../Pages/NavBar'
import socketManager from '../MesSockets'
import { SetParamsToGetPost } from '../Headers/HeaderManager'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
			console.log(opponent + " challenged you to a duel");
			const message: string = opponent + " challenged you to a duel";
			toast.success(message, {
   			 	position: toast.POSITION.TOP_RIGHT,
       			autoClose: 2000,
        		progressClassName: "my-progress-bar"
			});
		});

		socket.on('duelInviteCanceled', (opponent: string) =>
		{
			socket.emit('getInvites');
			console.log(opponent + " canceled his/her duel invitation");
			const message: string = opponent + " canceled his/her duel invitation";
			toast.success(message, {
   			 	position: toast.POSITION.TOP_RIGHT,
       			autoClose: 2000,
        		progressClassName: "my-progress-bar"
			});
		});

		socket.on('duelInviteAnswered', (opp_name: string, accepted: boolean) =>
		{
			let message: string = "";
			if (accepted)
			{
				console.log(opp_name + " accepted your duel invitation");
				message = opp_name + " accepted your duel invitation";
			}
			else
			{
				console.log(opp_name + " declined your duel invitation");
				message = opp_name + " declined your duel invitation";
			}
			socket.emit('getInvites');
			toast.success(message, {
   			 	position: toast.POSITION.TOP_RIGHT,
       			autoClose: 2000,
        		progressClassName: "my-progress-bar"
			});
		});

		socket.on('joinDuel', () =>
		{
				navigate('/pong/play');
		});

		socket.on('GameError', (response: any) =>
		{
			try
			{

			console.log(response);
			toast.error(response, {
   	     			position: toast.POSITION.TOP_RIGHT,
   	     			autoClose: 2000,
   	     			progressClassName: "my-progress-bar"
			});
			console.log(response);
			if (response === "Invalid Bearer token")// erreur de token ==> redirection vers la page de change login
              			navigate('/')
            		if (response === "User not registered")// ==> redirection vers la page de register
              			navigate('/Change')
            		if (response === "Invalid 2FA token") //erreur de 2FA ==> redirection vers la page de 2FA
              			navigate('/Send2FA')

			}
			catch(error)
			{
				console.log("i'm a teapot");
			}	
		});
		
		socket.emit('getInvites');

		return () => {
			socket.off('duelInviteReceived');
			socket.off('duelInviteCanceled');
			socket.off('duelInviteAnswered');
			socket.off('joinDuel');
			socket.off('GameError');
		
		}

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
		<div className="pongMenu">
	<TopBar />
			<div className="menuTop">
				<h1 className="h1n2">PONG</h1>
				<button className="play" onClick={onClickPlay}>play</button>
			</div>
			<div className="menuMid">
				<h2 className="h2n1">Invitations</h2>
				<div className="invitesReceived">
					<div className="invitesTitle">Received :</div>
					<ul>
						{invitesReceived.map((elem: {name: string, uid: number}, index: number) => (
							<li key={index}>
								• duel invitation from: {elem.name}
									<button className="acceptDuel" onClick={() => { acceptDuel(elem.uid) }}>✓</button>
								<button className="declineDuel" onClick={() => { declineDuel(elem.uid) }}>✗</button>
							</li>
						))}
					</ul>
				</div>
				<div className="invitesSent">
					<div className="invitesTitle">Sent :</div>
					<ul>
						{invitesSent.map((elem: {name: string, uid: number}, index: number) => (
							<li key={index}>
								• invitation sent to: {elem.name}
								<button className="cancelDuelInvite" onClick={() => { cancelInvite(elem.uid) }}>✗</button>
							</li>
						))}
					</ul>
				</div>
			</div>
			<div className="menuBot">Rules
				<div className="Rules">• use the mouse to control the paddle</div>
				<div className="Rules">• 11 points to win</div>
				<div className="Rules">• 3mn timer</div>
				<div className="Rules">• variant : paddles shrink with time, ball is speeding up, press + for blowfish boost (3 uses)</div>
				<div className="Rules">• theme: press p for the progress theme, press m (like "middle age") to revert to the default one</div>
				<div className="Rules"><br/>• we may collect data to improve user experience</div>
			</div>
			   <ToastContainer /> 
		</div>
	);

}
