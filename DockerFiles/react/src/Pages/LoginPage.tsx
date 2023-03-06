import React from "react";
import {useState, useEffect} from 'react'
import { RequestChangeLogin } from "../Api/ChangeLogRequest";

export function ChangeLogin()
{
    const [login, setLogin] = useState("")
	interface mabite
	{
		name : string;
	}

    const [wait, setwait] = useState<mabite>({name:''})
    const [Ok, setOk] = useState<boolean>(false)
    
    const replaceLog = (event : any) =>
    {         
        event.preventDefault()
        console.log(`le nouveau login : ${wait}`)
        RequestChangeLogin(wait)
        
        .then(response => 
        {
            setOk(true)
            console.log("JE SEND UN LOGIN")   
            console.log(response.data)
        })
        .catch(error =>
        {
            console.log("ERROR AVEC  UN LOGIN")
            console.log(error)
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
            window.location.assign('/chat') ///change to profile page
    }, [Ok])
 
    return(
        <div style={{ height: "100vh"}}>

        <form action="submit" onSubmit={replaceLog}>
        <input 
        
        value={wait.name}
        type="text"
        placeholder='add log'
        onChange={Change}
        />
        <button>met moi un login frr</button>
        </form>
        </div>
       

    )
};