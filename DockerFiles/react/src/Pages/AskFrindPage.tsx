import React, { useState, useEffect } from "react";
import { VraimentIlSaoule } from '../aurelcassecouilles/VraimentIlEstCasseCouille'
import '../css/Buttons.css'
import { socketManager } from '../Pages/HomePage'
import { ToastContainer, toast, ToastOptions } from 'react-toastify';
import { TopBar } from "./TopBar";

let test : boolean = false
let socket: any
let tt : boolean = true


export  function AskFriend()
{
	
	if (tt === true && socket && socket.connected !== false)
	{
		tt = false ;
	}
	if (tt === true)
	{
		socket = socketManager.getFriendRequestSocket()
		console.log(socket )
		if (socket == null)
		{ 
			if ( test === false && VraimentIlSaoule().headers.Authorization !== null)
			{
				console.log("je sui null3")
				socket = socketManager.initializeFriendRequestSocket(VraimentIlSaoule().headers.Authorization)
				console.log(socket )
				test = true
			}
		}
		if (socket && socket.connected !== false)
		{
			tt = false ;
		}
		console.log(socket)
	}
	
	interface user
	{
		user : string;
	}

	
const MyCustomToast = ({response, Acceptnow, Refusednow, closeToast} : any) => {
	return (
	  <div>
		<p> {response.message}</p>
		<button onClick={ () => {Acceptnow(response); closeToast()}}>Accept</button>
		<button onClick={ () => {Refusednow(response); closeToast()}}>Refuse</button>
	  </div>
	);
  };




	useEffect(() => {
		const handleFriendRequest = (response: any) => {
			console.log("response")
			toast.success(response, {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 2000,
				progressClassName: "my-progress-bar"
			})
		}
		const handleErrorRequest = (response: any) => {
			
			console.log(response)
			toast.error(response, {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 2000,
				progressClassName: "my-progress-bar"
			})
		}

		const handleFriendRequestSpe = (response: any) => {
			console.log(response)
			if (response.message === `${response.user} send you a friend request !`) {
				console.log("dddd")
				toast.success(<MyCustomToast response={response} Acceptnow={Acceptnow} Refusednow={Refusednow} usera={userAc} closeToast={toast.dismiss} />,
					{
						position: toast.POSITION.TOP_RIGHT,
						autoClose: 2000,
						progressClassName: "my-progress-bar"
					})
			}
			else {
				toast.success(response, {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 2000,
					progressClassName: "my-progress-bar"
				})

			}
		}
		socket.removeListener('sendfriendrequest');
		socket.removeListener('acceptfriendrequest');
		socket.removeListener('refusefriendrequest');
		socket.removeListener('blockuser');
		socket.removeListener('deletefriend');
		socket.removeListener('unblockuser');
		socket.removeListener('RelationError');

		socket.on("sendfriendrequest", handleFriendRequestSpe);
		socket.on("refusefriendrequest", handleFriendRequest);
		socket.on("blockuser", handleFriendRequest);
		socket.on("deletefriend", handleFriendRequest);
		socket.on("unblockuser", handleFriendRequest);
		socket.on("acceptfriendrequest", handleFriendRequest);
		socket.on("RelationError", handleErrorRequest);

		return () => {
			socket.off("sendfriendrequest", handleFriendRequestSpe);
			socket.off("refusefriendrequest", handleFriendRequest);
			socket.off("blockuser", handleFriendRequest);
			socket.off("deletefriend", handleFriendRequest);
			socket.off("unblockuser", handleFriendRequest);
			socket.off("acceptfriendrequest", handleFriendRequest);
			socket.off("RelationError", handleErrorRequest);
		}
	}, [])




	
	///////////////////////////////////////////////////////////////////////// request send      ///////////////////////////////////////////////////////
	const [userAsk, setUserAsk] = useState<user>({user:''})
	
	const AskRequest = async(event : any) =>
	{         
		event.preventDefault()
		//emit  
		// console.log(user.user)
		await socket.emit("sendfriendrequest", userAsk);
		setUserAsk({user:''})
	}
	const ChangeAsk = ((event : any) =>
	{
		setUserAsk({user : event.target.value})
	})
	


	///////////////////////////////////////////////////////////////////////// request accept      ///////////////////////////////////////////////////////

	const [userAc, setUserAccept] = useState<user>({user:''})//1
	
	const Accept = async(event : any) =>
	{         
		event.preventDefault()
		//emit  
		// console.log(user.user)
		await socket.emit("acceptfriendrequest", userAc);
		setUserAccept({user:''})
	}

	const ChangeAccept = ((event : any) =>
	{
		setUserAccept({user : event.target.value})
	})

	const Acceptnow = async(userAs : user) =>
	{
		console.log(userAs)
		await socket.emit("acceptfriendrequest", userAs);
	}
	
	///////////////////////////////////////////////////////////////////////// request refused      ///////////////////////////////////////////////////////



	const [userRefuse, setUserRefused] = useState<user>({user:''})//2
	
	
	const Refused = async(event : any) =>
	{         
		event.preventDefault()
		//emit  
		// console.log(user.user)
		await socket.emit("refusefriendrequest", userRefuse);
		setUserRefused({user:''})
	}
	const ChangeRefused = ((event : any) =>
	{
		setUserRefused({user : event.target.value})
	})

	const Refusednow = async (userRef : user) =>
	{
		console.log(userRef)
		await socket.emit("refusefriendrequest", userRef);
	}

	///////////////////////////////////////////////////////////////////////// request block      ///////////////////////////////////////////////////////

	const [userblock, setUserblock] = useState<user>({user:''})//3
	
	
	const block = async(event : any) =>
	{         
		event.preventDefault()
		//emit  
		// console.log(user.user)
		await socket.emit("blockuser", userblock);
		setUserblock({user:''})
	}
	const Changeblock= ((event : any) =>
	{
		setUserblock({user : event.target.value})
	})

	///////////////////////////////////////////////////////////////////////// request delete      ///////////////////////////////////////////////////////
	
	const [userdelete, setUserdelete] = useState<user>({user:''})//4
	
	
	const deleteU = async(event : any) =>
	{         
		event.preventDefault()
		//emit  
		// console.log(user.user)
		await socket.emit("deletefriend", userdelete);
		setUserdelete({user:''})
	}
	const Changedelete= ((event : any) =>
	{
		setUserdelete({user : event.target.value})
	})

	///////////////////////////////////////////////////////////////////////// request unblock      ///////////////////////////////////////////////////////
	
	const [userunblock, setUserunblock] = useState<user>({user:''})//5
	
	
	const unblock = async(event : any) =>
	{         
		event.preventDefault()
		//emit  
		// console.log(user.user)
		await socket.emit("unblockuser", userunblock);
		setUserunblock({user:''})
	}
	const Changeunblock= ((event : any) =>
	{
		setUserunblock({user : event.target.value})
	})


	return(
		<div style={{ height: "100vh"}}>
			{/* /////////////////////////////////////////////////////////////////////// request send      /////////////////////////////////////////////////////// */}
		<TopBar/>
		<form action="submit" onSubmit={AskRequest}>
		<input 
		
		value={userAsk.user}
		type="text"
		placeholder='friend'
		onChange={ChangeAsk}
		/>
		<button>send</button>

		<br /><br /><br /><br /><br /><br />
	{/* ///////////////////////////////////////////////////////////////////////// request accept      /////////////////////////////////////////////////////// */}

		</form><ToastContainer/>
		<form action="submit" onSubmit={Accept}>
		<input 
		
		value={userAc.user}
		type="text"
		placeholder='friend'
		onChange={ChangeAccept}
		/>
		<button>accept</button>
		</form>

		<br /><br /><br /><br /><br /><br />
	
		{/* ///////////////////////////////////////////////////////////////////////// request refused      /////////////////////////////////////////////////////// */}


		<form action="submit" onSubmit={Refused}>
		<input 
		
		value={userRefuse.user}
		type="text"
		placeholder='friend'
		onChange={ChangeRefused}
		/>
		<button>Refused</button>
		</form>

		<br /><br /><br /><br /><br /><br />
		{/* ///////////////////////////////////////////////////////////////////////// request block      /////////////////////////////////////////////////////// */}
	
		<form action="submit" onSubmit={block}>
		<input 

		value={userblock.user}
		type="text"
		placeholder='friend'
		onChange={Changeblock}
		/>
		<button>block</button>
		</form>
		
 		<br /><br /><br /><br /><br /><br />
		
		 {/* ///////////////////////////////////////////////////////////////////////// request delete      /////////////////////////////////////////////////////// */}


		 <form action="submit" onSubmit={deleteU}>
		<input 

		value={userdelete.user}
		type="text"
		placeholder='friend'
		onChange={Changedelete}
		/>
		<button>delete</button>
		</form>

		<br /><br /><br /><br /><br /><br />
		
		{/* ///////////////////////////////////////////////////////////////////////// request unblock      /////////////////////////////////////////////////////// */}


		<form action="submit" onSubmit={unblock}>
 		<input 
 
 		value={userunblock.user}
 		type="text"
 		placeholder='friend'
 		onChange={Changeunblock}
 		/>
 		<button>unblock</button>
 		</form>
<ToastContainer/>
		</div>
	
		);
		
	}
	