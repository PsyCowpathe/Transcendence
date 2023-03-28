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
            console.log(response.data)
        })
        .catch(error =>
        {
            toast.error(error.response.data.message[0], {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
                progressClassName: "my-progress-bar"
            })
            console.log("ERROR AVEC  UN LOGIN")
            console.log(error.response.data.message[0])
        })
        setwait({name:''})
    }
    
    const Change = ((event : any) =>
    {
        setwait({name : event.target.value})
    })
    useEffect(() =>
    {
        if (Ok === true )
            window.location.assign('/TopBar') ///change to profile page
    }, [Ok])
 
    return(
        <div style={{ height: "100vh"}}>
        <TopBar/>
        <form action="submit" onSubmit={replaceLog}>
        <input 
        
        value={wait.name}
        type="text"
        placeholder='add log'
        onChange={Change}
        />
        <button>met moi un login frr</button>
        </form><ToastContainer />
        </div>
       

    )
};