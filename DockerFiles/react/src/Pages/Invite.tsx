import React, {useState} from "react";
import socketManager from "../MesSockets";
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'
import { SetParamsToGetPost } from '../Headers/HeaderManager';

export function Invite({channel} : {channel : string | null})
{
    const socket = socketManager.getChatSocket();
    const [SendInvite, setSendInvite] = useState<string>("")
    const [DeleteInvite, setDeleteInvite] = useState<string>("")
    const inviteFriend = (e : any) => {
        e.preventDefault()
        socket.emit("createinvitation", {name : SendInvite, channelname: channel})
        setSendInvite("" )
    }

   

    const deleteInvite = (e : any) => {
        e.preventDefault()

        socket.emit("deleteinvitation", {name : DeleteInvite, channelname: channel})
        setDeleteInvite("")
    }

//////////////////////////// <PONG INVITES/> //////////////////////////////
	
	const navigate = useNavigate();
	
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
            <form className="message-input" onSubmit={inviteFriend} >
                <input
                    type="text"
                    placeholder="Invite Request"
                    value={SendInvite}
                    onChange={(e) => setSendInvite(e.target.value)} />
                <button className="add-message-button" >Invite Friend</button>
            </form>
            <form className="message-input" onSubmit={deleteInvite} >
                <input
                    type="text"
                    placeholder="Invite Delete"
                    value={DeleteInvite}
                    onChange={(e) => setDeleteInvite(e.target.value)} />
                <button className="add-message-button" >Delete Invite</button>
            </form>
			   <ToastContainer /> 
        </div>

    )

}
