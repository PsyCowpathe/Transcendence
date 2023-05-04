import React from "react";
import { Send2FA } from "../Api/send2FA";
import { useState } from "react";
import '../css/Force.css'
import { SetParamsToGetPost } from "../Headers/HeaderManager";
import { socketManager } from "./HomePage";
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';


interface code {
  code: number
}

function Resend() {

	
  const navigate = useNavigate();
  const [Code, setCode] = useState<code>({ code: 0 })

  const send = (e: any) => {
    e.preventDefault();

    Send2FA(Code)
      .then(async (res) => {
        localStorage.setItem('2FA', res.data.newFA)
        await socketManager.initializeChatSocket(SetParamsToGetPost().headers.Authorization)
        await socketManager.initializeFriendRequestSocket(SetParamsToGetPost().headers.Authorization)
        await socketManager.initializePongSocket(SetParamsToGetPost().headers.Authorization)
        await socketManager.initializeStatusSocket(SetParamsToGetPost().headers.Authorization)
        navigate('/AffUser')
      })
      .catch((err) => {
        if (err.response) {
          if (err.message !== "Request aborted") {
            if (err.message !== "Request aborted") {
              if (err.response.data.message === "Invalid user" || err.response.data.message === "Invalid Bearer token")// erreur de token ==> redirection vers la page de change login
                navigate('/')
              if (err.response.data.message === "User not registered")// ==> redirection vers la page de register
                navigate('/Change')
              if (err.response.data.message === "Invalid 2FA token") //erreur de 2FA ==> redirection vers la page de 2FA
                navigate('/Send2FA')
            }
          }
        }
        console.log(err)
      }
      )
    setCode({ code: 0 })
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


  return (
    <div>
      <form className="form" onSubmit={send}>
        <label>
          2FA code
          <input type="number" value={Code.code} onChange={(e) => setCode({ code: parseInt(e.target.value) })} />
        </label>
        <br />
        <button type="submit">Send</button>
      </form>
    </div>


  )
}

export function Resend2FA() {
  return (
    <div className="container">
      <h1 className="title">You have to resend your 2FA Code</h1>

      <Resend />
	     <ToastContainer /> 
    </div>
  );
}
