import { redirectTo42API } from "../Api/AuthRequest"
import {useEffect } from 'react'
import {useState} from 'react'
import React from "react";
import Button from "../style/Button";
import { SendTokenRequest } from "../Api/SendToken";
import '../css/App.css'
import { useNavigate } from 'react-router-dom'
import socketManager from "../MesSockets";
import { SetParamsToGetPost } from "../Headers/HeaderManager";
import { TopBar } from "./TopBar";
// https://mui.com/material-ui/getting-started/installation/ 
// let Mysocks : any = new SocketManager
const info = {
	name : 'name'
}

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
	console.log("debut de fonction")
	async function onClick ()
	{

		try
		{
			const { data } = await redirectTo42API()
			// alert(data)
			navigate(data)
		}
		catch (e)
		{  
			console.error(e)
		}
	}


	async  function  handleToken()
	{
		console.log("je rentre dans le token")
		const localStorage = window.localStorage;
	
		if (tokenForm.code != null)
		{
			console.log("je send un truc")
			console.log(tokenForm.code)
			 SendTokenRequest(tokenForm)
			.then(response => 
			{
				console.log("CA SEND")
				// alt.emit('notify:sendMessage', {iconType: 0, title: 'notification', message: 'this is a notification send from the client', color: 'F88F01', width: 244, duration: 3000})
				console.log(response.data)
				// if (response.data != null)
				// {
					console.log(`voila la data de la reponse ${response.data}`)
					localStorage.setItem('Token', response.data.newtoken);
					localStorage.setItem('name', response.data.name);
					localStorage.setItem('UID', response.data.id);
					const date : any = localStorage.getItem('Token')

					console.log("----------------------------------------------------------------------------------------------")
					console.log(date)
					console.log(response.data)
					console.log("BITE ?")
					onLogin()
					
					let reg : boolean = response.data.registered
					if (reg === true)
					{
						console.log("je suis deja inscrit")
						setReg(true)
						//register --> profil user
					}
					else
					{
						console.log("je suis pas inscrit")
						setMybool(true)
						//nope so first connect
					}
// }
			})
			.catch(error => 
			{
				//alert(error)
				console.log("REPONSE ERREUR : ");
				console.log(error.response)
			});
				console.log("wtf")
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
		// const testtoken : any = localStorage.getItem('Token') 
        if (codes != null)
		{
			setToken({state: second_states, code: codes})
    		console.log(tokenForm)
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
		// console.log("wtf")
		if (Registered !== false)
		{
			console.log("wtf")

			setReg(false)
			socketManager.initializeChatSocket(SetParamsToGetPost().headers.Authorization)
			socketManager.initializeFriendRequestSocket(SetParamsToGetPost().headers.Authorization)
			socketManager.initializePongSocket(SetParamsToGetPost().headers.Authorization)
			socketManager.initializeStatusSocket(SetParamsToGetPost().headers.Authorization)
		
			onLogin()
			navigate('/affUser')
			console.log("wtf")

		}		
	}, [Registered])
	

	return (
			<div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
			  {/* <img src={Logimg} alt="imgs/360_F_122719584_A863mvJEcEAnqmGQ4ky6RbXEhsHKw95x.jpg" style={{ maxWidth: "100%", maxHeight: "80%" }} /> */}
			  <Button onClick={onClick} >login</Button>
			</div>
		  );
	}
export {socketManager};

export default HomePage;
