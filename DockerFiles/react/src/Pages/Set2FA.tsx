import QRCode from 'qrcode.react';
import * as OTPAuth from 'otpauth';
import { Get2FA } from '../Api/Get2FA';
import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import { SetParamsToGetPost } from '../Headers/HeaderManager';
import { TopBar } from './NavBar';
import { Send2FA } from '../Api/send2FA';
import { socketManager } from './HomePage';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface code {
  code: number
}
export function Set2FA() {
 

   
	const [Open, setOpen] = useState(false)
  const navigate = useNavigate();
  const [Code2FA, setCode2FA] = useState<code>({ code: 0 })
  const HandleCode = (e: any) => {
    e.preventDefault()
    let config = SetParamsToGetPost()
    Send2FA(Code2FA)
      .then(async (res) => {
        toast.success("2FA login method succesfully activaded", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
          progressClassName: "my-progress-bar"
        })
        setOpen(false)
        localStorage.setItem('2FA', res.data.newFA)
        await socketManager.initializeChatSocket(SetParamsToGetPost().headers.Authorization)
        await socketManager.initializeFriendRequestSocket(SetParamsToGetPost().headers.Authorization)
        await socketManager.initializePongSocket(SetParamsToGetPost().headers.Authorization)
        await socketManager.initializeStatusSocket(SetParamsToGetPost().headers.Authorization)
      })
      .catch((err) => {
        if (err.response) {
          if (err.message !== "Request aborted") {
            if (err.response.data.message === "Invalid user" || err.response.data.message === "Invalid Bearer token")
              navigate('/')
            if (err.response.data.message === "User not registered")
              navigate('/Change')
            if (err.response.data.message === "Invalid 2FA token")
              navigate('/Send2FA')
          }
        }
        toast.error(err.response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
          progressClassName: "my-progress-bar"
        })

      }
      )
    setCode2FA({ code: 0 })
  }

  const [img, setImg] = useState<string>('')
  const [active, setActive] = useState(false)
  const Active = () => {


    Get2FA()
      .then((res) => {
        setOpen(true)
        setActive(true)
        let uri = new OTPAuth.URI()
        uri = res.data

        setImg(uri.toString())
      })
      .catch((err) => {
        if (err.response) {
          if (err.message !== "Request aborted") {
            if (err.response.data.message === "Invalid user" || err.response.data.message === "Invalid Bearer token")
              navigate('/')
            if (err.response.data.message === "User not registered")
              navigate('/Change')
            if (err.response.data.message === "Invalid 2FA token")
              navigate('/Send2FA')
          }
        }
        toast.error(err.response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
          progressClassName: "my-progress-bar"
        })
      }
      )
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
      <TopBar />
      <button onClick={Active}>active 2FA</button>
      {active && <QRCode style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%", objectFit: "cover" }} value={img} />}
      {Open && <form style={{ display: "flex", justifyContent: "center", alignItems: "center" }} onSubmit={HandleCode}>
        <input type="number" placeholder="0" value={Code2FA.code} onChange={(e) => setCode2FA({ code: parseInt(e.target.value) })} />
        <button>Send 2FA</button>
      </form>
      }
	     <ToastContainer /> 
    </div>
  )
}
