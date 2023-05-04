import React from 'react';
import { useEffect, useState } from 'react';
import { GetMatchHistory } from '../Api/GetMatchHistory';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import socketManager from '../MesSockets';
import { SetParamsToGetPost } from '../Headers/HeaderManager';
import '../css/chat.css';

interface User {
    name: string;
    uid : number
  }
  
interface Match {
	id 	: number; 
  scoreP1 : number;
  scoreP2 : number;
  nameP1  : string;
  nameP2  : string;
}

  interface Props {
    user: User;
  }
export function MatchHist({User} : {User : User})
{
    const navigate = useNavigate()
    const [History , setHistory] = useState<Match[]>([])

    useEffect(() => {
        GetMatchHistory(User.uid)
        .then((res) => {

          setHistory(res.data.map((match : any, index : any) => {
            return ({
				id 	: index,
              scoreP1 : match.scoreP1,
              scoreP2 : match.scoreP2,
              nameP1  : match.P1,
              nameP2  : match.P2
            })
          })
          )
        }
        )
        .catch ((err) => {
            if (err.response) {
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
        )
    }, [])


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


return(
    <div>
        <h1>Match History</h1>
        <div className="class_hist" >
            {History.map((match) => {
                return (
                    <div key={match.id}>
                        <p   key={match.id} >{match.nameP1} {match.scoreP1} - {match.scoreP2} {match.nameP2}</p>
                    </div>)
            })}
        </div>
		   <ToastContainer /> 
    </div>

)
}
