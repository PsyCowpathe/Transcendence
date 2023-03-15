import { redirectTo42API } from "../Api/AuthRequest"
import {useEffect } from 'react'
import {useState} from 'react'
import React from "react";
import Button from "../style/Button";
import { SendTokenRequest } from "../Api/SendToken";
import '../css/App.css'
import { useNavigate } from 'react-router-dom'
import socketManager from "../MesSockets";
import { VraimentIlSaoule } from "../aurelcassecouilles/VraimentIlEstCasseCouille";
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
			window.location.assign(data)
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
				if (response.data != null)
				{
					console.log(`voila la data de la reponse ${response.data.newtoken}`)
					localStorage.setItem('Token', response.data.newtoken);
					const date : any = localStorage.getItem('Token')

					console.log("----------------------------------------------------------------------------------------------")
					console.log(date)
					console.log(response.data)
					console.log("BITE ?")
					let reg : boolean = response.data.registered
					onLogin()

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
				}
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
	    const date : string | null = localStorage.getItem('Token')
		console.log("tema le Token1")
		console.log(date)

	}
	
	const handleUrlSearchParams = async() => 
	{
        console.log("wesh les params changent")
        const urlSearchParams = new URLSearchParams(window.location.search);
        let codes : string | null = urlSearchParams.get('code')
        let second_states : string | null = urlSearchParams.get('state')
		const testtoken : any = localStorage.getItem('Token') 
		console.log("bdjslvablkdgvb")
		console.log(testtoken)
        if (codes != null)
		{
        	console.log("wesh le token")
			setToken({state: second_states, code: codes})
    		console.log(tokenForm)
    		sendToken();
		}
		else if (testtoken !== null)
		{
			console.log("pk je passe pas ici")
			onLogin()
			navigate('/affUser')
		}
    }


    useEffect(() => 
    {
        console.log("wesh le useeffect")
        handleUrlSearchParams(); 
    }, [tokenForm.code]);
	
	useEffect(() =>
	{
		console.log(`----------------------777--------------${Mybool}`)
		if (Mybool !== false)
		{
			console.log("trueeeeeeeeeeeeeeeeeeeee22222222222222222222222")
			onLogin()
			navigate('/change')
			
			setMybool(false)
		}
	}, [Mybool])
	
	useEffect(() =>
	{
		if (Registered !== false)
		{
			setReg(false)
			// socketManager.initializeChatSocket(VraimentIlSaoule().headers.Authorization)
			socketManager.initializeFriendRequestSocket(VraimentIlSaoule().headers.Authorization)
			// socket.on("sendfriendrequest", (reponse: any) => 
			// {
			// 	toast.success(reponse, {
			// 		position: toast.POSITION.TOP_RIGHT, 
						  
			// 	});
			// 	console.log("la rep :")
			// 	console.log(reponse)
			// });
			// socketManager.initializePogSocket(VraimentIlSaoule().headers.Authorization)
			console.log(socketManager.getChatSocket())
			console.log("c bon frere j ai cree ta merde")
			console.log("trueeeeeeeeeeeeeeeeeeeee")
			onLogin()
			navigate('/affUser')
		}		
	}, [Registered])
	

	return (
			<div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
			  {/* <img src={Logimg} alt="imgs/360_F_122719584_A863mvJEcEAnqmGQ4ky6RbXEhsHKw95x.jpg" style={{ maxWidth: "100%", maxHeight: "80%" }} /> */}
			  <Button onClick={onClick} >login</Button>
			</div>
		  );

		// <div >
		// 		<h1 className="h1t">Ft_trancendence <br/>
		// 		</h1>
		// 			<Button onClick={onClick} >login</Button>
		
		
		// </div>
	}
	export {socketManager};

export default HomePage;

// 	const sendptn = (() =>{
// 	const urlSearchParams = new URLSearchParams(window.location.search);
// 	let codes : string | null = urlSearchParams.get('code')
// 	let second_states : string | null = urlSearchParams.get('state')
// 	        //  token.code = codes
//         //  token.second_state = second_states
//     //setToken = [{state : second_states ,code: codes}]
// 	console.log(token.code)
// 	})
//   //  window.location.replace("/auth/register")
//   useEffect(() => 
//   {
// 	  console.log("wesh le useeffect")
// 	  console.log(token.code)
	  
// 		sendptn()
// 	}, [window.location.search]);
