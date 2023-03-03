import { redirectTo42API } from "../Api/AuthPage"
import logo from '../ade3b5ea214ca737f53ce0bce98938c2.jpg';
import {useEffect } from 'react'
import {useState } from 'react'
import axios from 'axios';
import { handleToken } from "../Api/SendToken";
import { AuthRedirectionPage } from "./AuthRedirect";
import { useNavigate, useSearchParams } from 'react-router-dom'
import React from "react";
import Button from "../bouton/Button";




export function HomePage ({token, setToken} : any)
{
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
	
	async function sendToken()
	{
		await handleToken({token})
		//window.location.assign('/')

	}
    
    const handleUrlSearchParams = async() => 
    {
        console.log("wesh les params changent")
        const urlSearchParams = new URLSearchParams(window.location.search);
        let codes : string | null = urlSearchParams.get('code')
        let second_states : string | null = urlSearchParams.get('state')
        if (codes != null)
		{
			setToken({state: second_states, code: codes})
        	console.log("wesh le token")
        	console.log(token)
        	sendToken();
			console.log("j ai le tooken shala")
		}
			//window.location.assign('/')

    }

    useEffect(() => 
    {
        console.log("wesh le useeffect")
        handleUrlSearchParams();
			//window.location.assign('/')

    }, [token.code]);

/*
	const myImage = (
		<img
		  src="https://example.com/image.jpg"
		  alt="example image"
		  className="img-fluid mr-3"
		  style={{ maxWidth: "200px", float: "left" }}
		/>
	  );*/
			//window.location.assign('/')

	return (
		<div className="App">
			<header className="App-header" >
				{/* <img src={logo} className="App-logo" alt="logo" /> */}
				<h1>Ft_trancendence <br/>
				</h1>
				<img
				src={logo}
				alt="logo"
				className="img-fluid float-left mr-3"
				style={{ maxWidth: "200px", float: "left" }}
				 />
					<Button  style={{ maxWidth:"20000000px",  float: "left" }} onClick={onClick} >login</Button>

			</header>
		</div>
	)
}

















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
