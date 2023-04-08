import React from "react";
import {useState, useEffect} from 'react'
import { RequestChangeLogin } from "../Api/ChangeLogRequest";
import { TopBar } from "./TopBar";
import { ToastContainer, toast } from 'react-toastify';

export function ChangeLogin()
{
    const [login, setLogin] = useState("")
	interface user
	{
		name : string;
	}

    const [wait, setwait] = useState<user>({name:''})
    const [Ok, setOk] = useState<boolean>(false)
    
    const replaceLog = (event : any) =>
    {         
        event.preventDefault()
        console.log(`le nouveau login : ${wait.name}`)
        RequestChangeLogin(wait)
        
        .then(response => 
        {
            setOk(true)
            console.log("JE SEND UN LOGIN")
			localStorage.setItem('name', response.data.name);

            console.log(response.data) 
            
        })
        .catch(err =>
        {
            toast.error(err.response.data.message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
                progressClassName: "my-progress-bar"
            })

            if(err.response.data.message == "Invalid user" || err.message.data.message === "Invalid Bearer token")// erreur de token ==> redirection vers la page de change login
            {
              console.log("coucou ?")
              window.location.assign('/')
            }
            if ( err.message === "User not registered")// ==> redirection vers la page de register
            {
              console.log("ERROR")
              console.log(err)
              window.location.assign('/Change')
           }
           // if(err.message === "Invalid 2FA token") erreur de 2FA ==> redirection vers la page de 2FA
            console.log("ERROR AVEC  UN LOGIN")
            console.log(err.response.data.message[0])
        })
        setwait({name:''})
    }

    const Change = ((event : any) =>
    {
        setwait({name : event.target.value})
    })

    useEffect(() =>
    {
        // if (Ok === true )
        //     window.location.assign('/affUser') ///change to profile page
    }, [Ok])
 
    return(
        <div>
        <TopBar/>
        <form action="submit" onSubmit={replaceLog}>
        <input 
        
        value={wait.name}
        type="text"
        placeholder='add log'
        onChange={Change}
        />
        <button>New Login</button>
        </form><ToastContainer />
        </div>
       

    )
};
