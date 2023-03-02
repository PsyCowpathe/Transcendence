import {useEffect } from 'react'
import {useState } from 'react'
import axios from 'axios';
//import Cookies from 'universal-cookies';
import { CookiesProvider } from "react-cookie";


let uid = "u-s4t2ud-21f144616dae6f0e27670562f16d1b3b8782bbad40c0d1ea5f0d1d54eae9d61f";
let redirect = encodeURIComponent("http://localhost:3000");
let first_states : string | null = "dwdadfegthyhgfdASYJTUNBFSDRGW48754454"
const URL: string = `https://api.intra.42.fr/oauth/authorize?client_id=${uid}&redirect_uri=${redirect}&response_type=code&scope=public&state=${first_states}`
let ispass : number = 0;
let URLCLEAN : string = "http://localhost:3000";
let booli : boolean = false;


// export async function redirectTo42API ()
// {
// 	return axiosClient.get("/auth", axiosConfig);
// }


export default function AuthToken({token, setToken, setCookie, cookies}: any){
    const handleClick = () => 
    {
        console.log(`l ancien url : ${URLCLEAN}`)
        window.location.href = URL;
        console.log("la il oasse meme plus")
      //  handleUrlSearchParams()
    }
  
    const handleToken = async(token : any) => 
    {
      console.log("je rentre dans le token")

        if (token.code != null)
        {
          console.log("je send un truc")
           await axios.post("https://10.12.3.8:3630/auth/register", token)
          .then(response => {
            window.location.assign('/');
            console.log("REPONSE VALIDE")
            setCookie('token', response.data, {path: '/'})
            console.log("MAAAAA BIIIIITTTTEEEEE")
            // console.log(cookies)
            console.log(response.data)
            booli = true;
     console.log(booli)

           // return
          })
          .catch(error => {
            alert(error)
            console.log("REPONSE ERREUR : ");
            console.log(error.response.data.message);
            booli = false;
           // return
          });
          console.log("wtf ?")
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
        //  token.first_state = first_states
        //  token.code = codes
        //  token.second_state = second_states
          console.log("wesh le token")
          return handleToken(token);
    }

    useEffect(() => 
    {
        console.log("wesh le useeffect")
        console.log(token.code)
        
        handleUrlSearchParams();
      }, [token.code]);

   // console.log("IIIICCCCCIIIIIIIIII")
    //console.log(handleUrlSearchParams)

    if (booli == true)
    {
      return(
        <button>taratata</button>
        // <form action="rien">change tion login fdp</form>
        )
      }
      else 
    {
      return(
       <button onClick={handleClick}>Login</button>
        )
      }
  }