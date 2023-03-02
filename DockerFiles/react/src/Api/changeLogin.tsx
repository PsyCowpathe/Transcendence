import React from "react";
import {useState} from 'react'
import axios from 'axios';


export function ChangeLogin({login, setLogin} : any)
{

	interface mabite
	{
		name : string;

	}
    const [wait, setwait] = useState<mabite>({name:''})
    
   
      

        const replaceLog = (event : any) =>
        {
            event.preventDefault()           
            console.log(wait)
            axios.post("https://10.13.7.1:3630/auth/firstconnect", wait)
            .then(response => {
                console.log("JE SEND UN LOGIN")   
            })
            .catch(error =>{
                console.log("ERROR AVEC  UN LOGIN")
                console.log(error)
            })
            setwait({name:''})
        }
        
        const Change = ((event : any) =>
        {
            setwait({name : event.target.value})
        })
        // const newLogin = (() =>
        // {})

    
    
    return(
        <form action="submit" onSubmit={replaceLog}>
        <input 
        value={wait.name}
        type="text"
        placeholder='add log'
        onChange={Change}
        />
        <button>met moi un login frr</button>
        </form>
       

    )
};