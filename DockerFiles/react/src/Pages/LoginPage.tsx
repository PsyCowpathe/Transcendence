import React from "react";
import {useState, useEffect} from 'react'
import { RequestChangeLogin } from "../Api/ChangeLogRequest";



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
            console.log(response)
        })
        .catch(error =>
        {
            console.log("ERROR AVEC  UN LOGIN")
            console.log(error.message)
        })
        setwait({name:''})
    }
    
    const Change = ((event : any) =>
    {
        setwait({name : event.target.value})
    })
    useEffect(() =>
    {
<<<<<<< HEAD
        if (Ok === true )
            window.location.assign('/affUser') ///change to profile page
=======
        //if (Ok === true )
          //  window.location.assign('/chat') ///change to profile page
>>>>>>> master
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
