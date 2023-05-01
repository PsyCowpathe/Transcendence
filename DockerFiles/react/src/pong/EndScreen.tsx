import "./pong.endscreen.css"
import React from "react"
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef, Ref } from "react"
import { ToastContainer, toast } from 'react-toastify';
import socketManager from '../MesSockets';
import { SetParamsToGetPost } from '../Headers/HeaderManager';


export default function EndScreen()
{
	const navigate = useNavigate();

	let title: HTMLElement | null;
	let ps: HTMLElement | null;
	const params = new URLSearchParams(window.location.search);
	const result = params.get('result');
	const forfeit = params.get('forfeit');
	const flagged = params.get('flagged');

	useEffect(() =>
	{
		title = document.getElementById("result");
		ps = document.getElementById("ps");
		if (title && result == "victory")
		{
			title.style.color = 'green';
			title.textContent = "VICTORY";
			if (forfeit && ps)
			{
				ps.style.color = 'green';
				ps.textContent = '(your opponent left)';
				ps.style.display = "flex";
			}
			else if (flagged && ps)
			{
				ps.style.color = 'green';
				ps.textContent = '(your opponent lost on time)';
				ps.style.display = "flex";
			}
		}
		else if (title && result == "defeat")
		{
			title.style.color = 'red';
			title.textContent = "DEFEAT";
			if (forfeit && ps)
			{
				ps.style.color = 'red';
				ps.textContent = '(you just left the game)';
				ps.style.display = "flex";
			}
			else if (flagged && ps)
			{
				ps.style.color = 'red';
				ps.textContent = '(you lost on time)';
				ps.style.display = "flex";
			}
		}
		else if (title && ps && result == "draw")
		{
			title.style.color = 'yellow';
			title.textContent = "DRAW";
			ps.textContent = '(time is up)';
			ps.style.color = 'yellow';
			ps.style.display = "flex";
		}
		else if (title)
		{
			title.style.color = 'yellow';
			title.textContent = "dude, get a life";
		}
	}, []);

	function buttonHandler()
	{
		navigate('/pong/menu');
	}

		//////////////////////////// <PONG INVITES/> //////////////////////////////
	
	
	useEffect(() =>
	{
		let socketPong: any;
		
		socketPong = socketManager.getPongSocket();
		if (!socketPong)
		{
			const token = SetParamsToGetPost().headers.Authorization;
			if (token !== null)
			{
				socketManager.initializePongSocket(token);
				socketPong = socketManager.getPongSocket();
			}
		}

		const handleGameError = (response: any) =>
		{
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

		};

		const handleDuelInviteReceived = (opponent: string) =>
		{
			const message = opponent + " challenged you to a pong duel";
			console.log(message);
	
		    toast.success(message, {
    			position: toast.POSITION.TOP_RIGHT,
       			autoClose: 2000,
       	 		progressClassName: "my-progress-bar"
      		});
		};

		const handleDuelInviteCanceled = (opponent: string) =>
		{
			const message = opponent + " canceled his/her duel invitation";
			console.log(message);
	
		    toast.success(message, {
   		     	position: toast.POSITION.TOP_RIGHT,
   		     	autoClose: 2000,
   	    		progressClassName: "my-progress-bar"
    	 	});
		}

		const handleDuelInviteAnswered = (opponent: string, accepted: boolean) =>
		{
			let message: string = "";
			if (accepted)
			{
				message = opponent + " accepted your duel invitation";
				console.log(message);
			}
			else
			{
				message = opponent + " delined your duel invitation";
				console.log(message);
			}
		    toast.success(message, {
   			 	position: toast.POSITION.TOP_RIGHT,
       			autoClose: 2000,
        		progressClassName: "my-progress-bar"
			});
		};

		function joinDuel()
		{
			navigate('/pong/play');
		}

		const handleJoinDuel = () =>
		{
			joinDuel();
		};

		socketPong.removeListener('duelInviteReceived');
		socketPong.removeListener('duelInviteCanceled');
		socketPong.removeListener('duelInviteAnswered');
		socketPong.removeListener('joinDuel');

		socketPong.on('duelInviteReceived', handleDuelInviteReceived);
		socketPong.on('duelInviteCanceled', handleDuelInviteCanceled);
		socketPong.on('duelInviteAnswered', handleDuelInviteAnswered);
		socketPong.on('joinDuel', handleJoinDuel);
		socketPong.on('GameError', handleGameError);

	    return () => {
			socketPong.off('duelInviteReceived', handleDuelInviteReceived);
			socketPong.off('duelInviteCanceled', handleDuelInviteCanceled);
			socketPong.off('duelInviteAnswered', handleDuelInviteAnswered);
			socketPong.off('joinDuel', handleJoinDuel);
			socketPong.off('GameError', handleGameError);
    	}

	}, []);


	//////////////////////////// <PONG INVITES/> //////////////////////////////


	return (<div className="pong endscreen">
			<div className="result" id="result">asdf</div>
			<div className="ps" id="ps"></div>
			<div className="redirect">click this button and you will be redirected to the menu</div>
			<button className="back_to_menu" onClick={buttonHandler}>click me</button>
		</div>
	);
}
