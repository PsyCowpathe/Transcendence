import { redirectTo42API } from "../Api/AuthRequest"
import {useEffect } from 'react'
import {useState} from 'react'
import React from "react";
import Button from "../style/Button";
import { SendTokenRequest } from "../Api/SendToken";
import '../css/App.css'
import { useNavigate } from 'react-router-dom'
import socketManager from "../MesSockets";
import '../css/UserPage.css';
import 'react-toastify/dist/ReactToastify.css';


import { SetParamsToGetPost } from "../Headers/HeaderManager";
import { ToastContainer, toast } from 'react-toastify';


interface chiant {
	tokenForm : any,
	setToken : any,
	onLogin : () => void

}
	const HomePage : React.FC<chiant> =  ({tokenForm, setToken, onLogin}) =>
{

	const [Mybool, setMybool] = useState<boolean>(false)
	const [Registered, setReg] = useState<boolean>(false)
	const [FirstCo, setFirstCo] = useState<boolean>(false)
	const navigate = useNavigate();  

	const localStorage = window.localStorage;
	async function onClick ()
	{
		redirectTo42API()
		.then(response =>
		{
			window.location.assign(response.data)
		})
		.catch(error =>
		{
			console.log(error.response)
		});
	}


	async  function  handleToken()
	{
		const localStorage = window.localStorage;
	
		if (tokenForm.code != null)
		{
			 SendTokenRequest(tokenForm)
			.then(response => 
			{
					localStorage.setItem('Token', response.data.newtoken);
					localStorage.setItem('name', response.data.name);
					localStorage.setItem('UID', response.data.id);
					const date : any = localStorage.getItem('Token')
					socketManager.initializeChatSocket(SetParamsToGetPost().headers.Authorization)
					socketManager.initializeFriendRequestSocket(SetParamsToGetPost().headers.Authorization)
					socketManager.initializePongSocket(SetParamsToGetPost().headers.Authorization)
					socketManager.initializeStatusSocket(SetParamsToGetPost().headers.Authorization)

					onLogin()
					let reg : boolean = response.data.registered
					if (reg === true)
						setReg(true)
					else
						setMybool(true)
			})
			.catch(error => 
			{
				console.log(error.response)
			});
	    }
	}

	async function sendToken()
	{ 
		handleToken()
	}
	
	const handleUrlSearchParams = async() => 
	{
        const urlSearchParams = new URLSearchParams(window.location.search);
        let codes : string | null = urlSearchParams.get('code')
        let second_states : string | null = urlSearchParams.get('state')
        if (codes != null)
		{
			setToken({state: second_states, code: codes})
    		sendToken();
		}

    }


    useEffect(() => 
    {
        handleUrlSearchParams(); 
    }, [tokenForm.code]);
	
	useEffect(() =>
	{
		if (Mybool !== false)
		{
			onLogin()
			navigate('/log')
			setMybool(false)
		}
	}, [Mybool])
	
	useEffect(() =>
	{
		if (Registered !== false)
		{

			setReg(false)
			
		
			onLogin()
			navigate('/affUser')

		}		
	}, [Registered])
	

	//////////////////////////// <PONG INVITES/> //////////////////////////////
	
	// useEffect(() =>
	// {
	// 	let socketPong: any;
		
	// 	socketPong = socketManager.getPongSocket();
	// 	if (!socketPong)
	// 	{
	// 		const token = SetParamsToGetPost().headers.Authorization;
	// 		if (token !== null)
	// 		{
	// 			socketManager.initializePongSocket(token);
	// 			socketPong = socketManager.getPongSocket();
	// 		}
	// 	}

	// 	const handleGameError = (response: any) =>
	// 	{
	// 	    toast.error(response, {
   	//      		position: toast.POSITION.TOP_RIGHT,
   	//      		autoClose: 2000,
   	//      		progressClassName: "my-progress-bar"
	// 		});
	// 		console.log(response);
	// 	};

	// 	const handleDuelInviteReceived = (opponent: string) =>
	// 	{
	// 		const message = opponent + " challenged you to a pong duel";
	// 		console.log(message);
	
	// 	    toast.success(message, {
    // 			position: toast.POSITION.TOP_RIGHT,
    //    			autoClose: 2000,
    //    	 		progressClassName: "my-progress-bar"
    //   		});
	// 	};

	// 	const handleDuelInviteCanceled = (opponent: string) =>
	// 	{
	// 		const message = opponent + " canceled his/her duel invitation";
	// 		console.log(message);
	
	// 	    toast.success(message, {
   	// 	     	position: toast.POSITION.TOP_RIGHT,
   	// 	     	autoClose: 2000,
   	//     		progressClassName: "my-progress-bar"
    // 	 	});
	// 	}

	// 	const handleDuelInviteAnswered = (opponent: string, accepted: boolean) =>
	// 	{
	// 		let message: string = "";
	// 		if (accepted)
	// 		{
	// 			message = opponent + " accepted your duel invitation";
	// 			console.log(message);
	// 		}
	// 		else
	// 		{
	// 			message = opponent + " delined your duel invitation";
	// 			console.log(message);
	// 		}
	// 	    toast.success(message, {
   	// 		 	position: toast.POSITION.TOP_RIGHT,
    //    			autoClose: 2000,
    //     		progressClassName: "my-progress-bar"
	// 		});
	// 	};

	// 	function joinDuel()
	// 	{
	// 		navigate('/pong/play');
	// 	}

	// 	const handleJoinDuel = () =>
	// 	{
	// 		joinDuel();
	// 	};

	// 	socketPong.removeListener('duelInviteReceived');
	// 	socketPong.removeListener('duelInviteCanceled');
	// 	socketPong.removeListener('duelInviteAnswered');
	// 	socketPong.removeListener('joinDuel');

	// 	socketPong.on('duelInviteReceived', handleDuelInviteReceived);
	// 	socketPong.on('duelInviteCanceled', handleDuelInviteCanceled);
	// 	socketPong.on('duelInviteAnswered', handleDuelInviteAnswered);
	// 	socketPong.on('joinDuel', handleJoinDuel);
	// 	socketPong.on('GameError', handleGameError);

	//     return () => {
	// 		socketPong.off('duelInviteReceived', handleDuelInviteReceived);
	// 		socketPong.off('duelInviteCanceled', handleDuelInviteCanceled);
	// 		socketPong.off('duelInviteAnswered', handleDuelInviteAnswered);
	// 		socketPong.off('joinDuel', handleJoinDuel);
	// 		socketPong.off('GameError', handleGameError);
    // 	}

	// }, []);


	//////////////////////////// <PONG INVITES/> //////////////////////////////


	return (
			<div  style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
			  <Button className="user-button" onClick={onClick} >Sign In</Button>
			</div>
		  );
	}
export {socketManager};

export default HomePage;
