import React from "react";
import {useState, useEffect} from 'react'
import { RequestChangeLogin } from "../Api/ChangeLogRequest";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
export function ChangeLoginMod()
{
    const navigate = useNavigate(); 
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
            toast.success("login change succesfully", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
                progressClassName: "my-progress-bar"
            })
            console.log("JE SEND UN LOGIN")
			localStorage.setItem('name', response.data.name);
            localStorage.setItem('UID', response.data.id); 
            console.log(response) 
            
        })
        .catch(err =>
        {
            // console.log("ici ")
            toast.error(err.response.data.message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
                progressClassName: "my-progress-bar"
            })

            if(err.response.data.message == "Invalid user" || err.message.data.message === "Invalid Bearer token")// erreur de token ==> redirection vers la page de change login
            {
              console.log("coucou ?")
                navigate('/')
            }
            if ( err.message === "User not registered")// ==> redirection vers la page de register
            {
              console.log("ERROR")
              console.log(err)
              navigate('/Change')
           }
           // if(err.message === "Invalid 2FA token") erreur de 2FA ==> redirection vers la page de 2FA
            console.log("ERROR AVEC  UN LOGIN")
            console.log(err.response.data.message[0])
        })
        setwait({name:''})
    }

    // const Change = ((event : any) =>
    // {
    //     setwait({name : event.target.value})
    // })

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