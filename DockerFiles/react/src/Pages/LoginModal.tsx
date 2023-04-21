import React from "react";
import {useState, useEffect} from 'react'
import { RequestChangeLogin } from "../Api/ChangeLogRequest";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
export function ChangeLoginMod()
{
    const navigate = useNavigate(); 
	interface user
	{
		name : string;
	}

    const [wait, setwait] = useState<user>({name:''})
    const [Ok, setOk] = useState<boolean>(false)
    
    const replaceLog = (event : any) =>
    {         
        event.preventDefault()
        RequestChangeLogin(wait)
        
        .then(response => 
        {
            setOk(true)
            toast.success("login change succesfully", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
                progressClassName: "my-progress-bar"
            })
			localStorage.setItem('name', response.data.name);
            localStorage.setItem('UID', response.data.id); 
            
        })
        .catch(err =>
        {
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
            console.log(err.response.data.message[0])
        })
        setwait({name:''})
    }

    return(
        <div>
        <form action="submit" onSubmit={replaceLog}>
        <input 
        value={wait.name}
        type="text"
        placeholder='add log'
        onChange={(e) =>  setwait({name : e.target.value})}
        />
        <button>New Login</button>
        </form><ToastContainer />
        </div>
       

    )
};
