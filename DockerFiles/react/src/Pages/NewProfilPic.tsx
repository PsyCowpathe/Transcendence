import React from "react";
import { useState } from "react";
import { TopBar } from "./NavBar";
import { SetParamsToGetPost } from '../Headers/HeaderManager';
import { UploadPicRequest } from "../Api/UploadPicRequest";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react';
import socketManager from '../MesSockets';


function ProfilePictureUploader() {
  const [image, setImage] = useState<string | null>(null);
  const navigate = useNavigate()

  
  const SendToBack = (data : any) => {
    UploadPicRequest(data)
    .then(response =>
      {
        toast.success(response.data , {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
          progressClassName: "my-progress-bar"
        })
        const url = window.URL.createObjectURL(new Blob([data]));
        localStorage.setItem('ProfilPic', url)
      })
      .catch(err => {
        toast.error(err.response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
          progressClassName: "my-progress-bar"
        })
        if(err.response)
        {
        if (err.message !== "Request aborted")
        {
          if (err.message !== "Request aborted") {
            if (err.response.data.message === "Invalid user" || err.response.data.message === "Invalid Bearer token")// erreur de token ==> redirection vers la page de change login
              navigate('/')
            if (err.response.data.message === "User not registered")// ==> redirection vers la page de register
            navigate('/Change')
            if(err.response.data.message === "Invalid 2FA token") //erreur de 2FA ==> redirection vers la page de 2FA
              navigate('/Send2FA')
          }
        }
      }

        console.log(err.response.data.message)
      })
  }


  // Fonction pour gérer le glisser-déposer
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    let config = SetParamsToGetPost()
    const files = event.dataTransfer.files;
    const data = new FormData();
    data.append("file", files[0]);
    SendToBack(data)


    if (files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setImage(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  }

  // Fonction pour empêcher le comportement par défaut du navigateur pour le glisser-déposer
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }
  const [file, setFile] = useState(null);

  const handleFileChange = (event : any) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event : any) => {
    event.preventDefault();

    const data = new FormData();
    if (file !== null)
      data.append("file", file);
      SendToBack(data)


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
    <div className="App">
      <TopBar />
      <h1 className="textcol2">Drag and Drop Image</h1>
      <div
        className="dropzone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >drag and drop your image here
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button type="submit">Uploader</button>
        </form>
      </div>   <ToastContainer /> 
    </div>
  );
}
export default ProfilePictureUploader;
