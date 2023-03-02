import {useEffect } from 'react'
import {useState } from 'react'
import axios from 'axios';



let uid = "u-s4t2ud-21f144616dae6f0e27670562f16d1b3b8782bbad40c0d1ea5f0d1d54eae9d61f";
let redirect = encodeURIComponent("http://localhost:3000");
let first_states : string | null = "dwdadfegthyhgfdASYJTUNBFSDRGW48754454"
const URL: string = `https://api.intra.42.fr/oauth/authorize?client_id=${uid}&redirect_uri=${redirect}&response_type=code&scope=public&state=${first_states}`
let ispass : number = 0;
let URLCLEAN : string = "http://localhost:3000";



export default function AuthToken({token, setToken}: any){
 
    const handleClick = () => 
    {
        console.log(`l ancien url : ${URLCLEAN}`)
        window.location.href = URL;
    }
  

    const handleToken = async(token : any) => 
    {
        if (token.code != null)
        {
          console.log("je send un truc")
          const response =  axios.post("http://10.13.7.1:3630/auth/register", token)
          .then(response => {
            window.location.replace(URLCLEAN)
            console.log("REPoNSE VALIDE")
            console.log(token.code);
            console.log(response.data.acces_token)
            token.code = null
           console.log(`l ancien url : ${URLCLEAN}`)

          })
          .catch(error => {
            alert(error)
            console.log("REPONSE ERREUR : ");
            console.log(error.response.data.message);
          });
        }
    }

    const handleUrlSearchParams = () => 
    {
        console.log("wesh les params changent")
        const urlSearchParams = new URLSearchParams(window.location.search);
        let codes : string | null = urlSearchParams.get('code')
        let second_states : string | null = urlSearchParams.get('state')
        let bite : string | null = ''

        setToken({first_state: first_states, code: codes , second_state: second_states})
        
        if (token.code != null)
        {
          console.log("wesh le token")
          handleToken(token);
        }
    }

    useEffect(() => 
    {
        console.log("wesh le useeffect")
        console.log(token.code)
        
          handleUrlSearchParams();
    }, [token.code]);

    return(
        <button onClick={handleClick}>Login</button>
    )
  }