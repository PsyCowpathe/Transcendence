import React from "react";
import "../css/NotFound.css";
import { useNavigate } from "react-router-dom";
import IMGS from '../imgs/404.gif';
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import socketManager from '../MesSockets';
import { SetParamsToGetPost } from '../Headers/HeaderManager';


const NotFound: React.FC = () => {
    const navigate = useNavigate();
    const ComeBackHome = () => {
        navigate("/affUser");
    };

   

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
    <div className="not-found-container">
      <h1 className="not-found-heading">Oops! 404 Page Not Found</h1>
      <img src={IMGS} alt="404" />
      <p className="not-found-message">The page you are looking for does not exist.</p>
      <button onClick={ComeBackHome}>Come Back Home</button>
	     <ToastContainer /> 
    </div>
  );
};

export default NotFound;   
