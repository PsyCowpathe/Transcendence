import React, { useState, useEffect } from "react";
import { VraimentIlSaoule } from '../aurelcassecouilles/VraimentIlEstCasseCouille'
import '../css/Buttons.css'
import { socketManager } from '../Pages/HomePage'
import { ToastContainer, toast, ToastOptions } from 'react-toastify';

let test : boolean = false
let socket: any
let tt : boolean = true


export  function AskFriend()
{
	//console.log(socket )
	
	if (tt === true && socket && socket.connected !== false)
	{
		console.log("ta mere l groooooosse pute")
		tt = false ;
	}
	if (tt === true)
	{
		socket = socketManager.getFriendRequestSocket()
		console.log("je suis null1")
		console.log(socket )
		if (socket == null)
		{ 
			console.log("je suis null2")
			if ( test === false && VraimentIlSaoule().headers.Authorization !== null)
			{
				console.log("je suis null3")
				socket = socketManager.initializeFriendRequestSocket(VraimentIlSaoule().headers.Authorization)
				console.log(socket )
				test = true
			}
		}
		if (socket && socket.connected !== false)
		{
			console.log("ta mere l groooooosse pute")
			tt = false ;
		}
		console.log(socket)
	}
	
	interface user
	{
		user : string;
	}
// 	type ConfirmationToastProps = {
// 		response: string;
// 		Refusednow: (user: user) => void;
// 		Acceptnow: (user: user) => void;
// 		user: user;
// 	  };
// function ConfirmationToast({ response, Refusednow, Acceptnow, user } : ConfirmationToastProps) {
//   const handleYesClick = () => {
// 	  toast.dismiss();
// 	  Acceptnow(user);
// };

// const handleNoClick = () => {
// 	toast.dismiss();
// 	Refusednow(user);
//   };

//   const actionButtons = (
//     <div>
//       <button onClick={handleYesClick}>Oui</button>
//       <button onClick={handleNoClick}>Non</button>
//     </div>
//   );

//   toast.success(response, {
//     closeButton: false,
//     autoClose: false,
//     // actionButtons: actionButtons,
//   });

//   return null;
// }

	
const MyCustomToast = ({response, Acceptnow, Refusednow} : any) => {
	return (
	  <div>
		<p> |{response.message}|</p>
		<button onClick={ () => {Acceptnow(response)}}>Oui</button>
		<button onClick={ () => {Refusednow(response)}}>Non</button>
	  </div>
	);
  };
	
	
	///////////////////////////////////////////////////////////////////////// request send      ///////////////////////////////////////////////////////
	const [userAsk, setUserAsk] = useState<user>({user:''})
	useEffect(() =>
	{
		socket.removeListener('sendfriendrequest');
		console.log("demande d amis listen")
		// écoute l'événement de réception de message depuis le serveur
		socket.on("sendfriendrequest", (reponse: any) => 
		{
			// ConfirmationToast
			// ({
			// 	response: reponse,
			// 	Refusednow: Refusednow,
			// 	Acceptnow: Acceptnow,
			// 	user: userAsk
			// });
				toast.success( <MyCustomToast response={reponse} Acceptnow={Acceptnow} Refusednow={Refusednow} usera={userAc} />, {
					position: toast.POSITION.TOP_RIGHT, 
						
				});
				console.log("la rep :")
				console.log(reponse)
			});
		
		return () => socket.off("aurel sais pas coder et il pense que ca viens de moi")
	}, [])
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

	const [userAc, setUserAccept] = useState<user>({user:''})
	useEffect(() =>
	{
		socket.removeListener('acceptfriendrequest');
		console.log("demande d amis listen")
		// écoute l'événement de réception de message depuis le serveur
		socket.on("acceptfriendrequest", (reponse : any) => 
		{
			toast.success(reponse, {
        position: toast.POSITION.TOP_RIGHT,
		// closeButton: (
		// 	<div>
		// 	  <button onClick={Acceptnow(userAc)}>Bouton 1</button>
		// 	  <button onClick={Refusednow(userAc)}>Bouton 2</button>
		// 	</div>
		//   ),
    });
			console.log("la rep :")
			console.log(reponse)
		});
		return () => socket.off("aurel sais pas coder et il pense que ca viens de moi")
	}, [])
	
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



	const [userRefuse, setUserRefused] = useState<user>({user:''})
	useEffect(() =>
	{
		socket.removeListener('refusefriendrequest');
		console.log("demande d amis listen")
		// écoute l'événement de réception de message depuis le serveur
		socket.on("refusefriendrequest", (reponse: any) => 
		{
			toast.success(reponse, {
        position: toast.POSITION.TOP_RIGHT
    });
			console.log("la rep :")
			console.log(reponse)
		});
		return () => socket.off("aurel sais pas coder et il pense que ca viens de moi")
	}, [])
	
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

	const [userblock, setUserblock] = useState<user>({user:''})
	useEffect(() =>
	{
		socket.removeListener('blockuser');
		console.log("demande d amis listen")
		// écoute l'événement de réception de message depuis le serveur
		socket.on("blockuser", (reponse: any) => 
		{
			toast.success(reponse, {
        position: toast.POSITION.TOP_RIGHT
    });
			console.log("la rep :")
			console.log(reponse)
		});
		return () => socket.off("aurel sais pas coder et il pense que ca viens de moi")
	}, [])
	
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
	
	const [userdelete, setUserdelete] = useState<user>({user:''})
	useEffect(() =>
	{
		socket.removeListener('deletefriend');
		console.log("demande d amis listen")
		// écoute l'événement de réception de message depuis le serveur
		socket.on("deletefriend", (reponse: any) => 
		{
			toast.success(reponse, {
        position: toast.POSITION.TOP_RIGHT
    });
			console.log("la rep :")
			console.log(reponse)
		});
		return () => socket.off("aurel sais pas coder et il pense que ca viens de moi")
	}, [])
	
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
	
	const [userunblock, setUserunblock] = useState<user>({user:''})
	useEffect(() =>
	{
		socket.removeListener('unblockuser');
		console.log("demande d amis listen")
		// écoute l'événement de réception de message depuis le serveur
		socket.on("unblockuser", (reponse: any) => 
		{
			toast.success(reponse, {
        position: toast.POSITION.TOP_RIGHT
    });
			console.log("la rep :")
			console.log(reponse)
		});
		return () => socket.off("aurel sais pas coder et il pense que ca viens de moi")
	}, [])
	
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
		</form><ToastContainer/>

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
		</form><ToastContainer/>

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
		</form><ToastContainer/>
		
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
		</form><ToastContainer/>

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
 		</form><ToastContainer/>

		</div>
		);
		
	}
	
	// return(
	//     <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
	//     <Button onClick={Ask} >demande</Button>
	//   </div>