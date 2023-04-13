



import React from "react";
import { Send2FA } from "../Api/send2FA";
import { ChangeLogin } from "./LoginPage";
import { useState } from "react";
import '../css/Force.css'
import { SetParamsToGetPost } from "../Headers/VraimentIlEstCasseCouille";
import { socketManager } from "./HomePage";

interface code {
    code : number
  }

function Resend() 
{
    
    const [Code, setCode] = useState<code>({code : 0})

    const send = (e : any) => {
        e.preventDefault();
        console.log(Code);
        Send2FA(Code)
        .then((res) => {
            localStorage.setItem('2FA', res.data.newFA)
            socketManager.initializeChatSocket(SetParamsToGetPost().headers.Authorization)
			socketManager.initializeFriendRequestSocket(SetParamsToGetPost().headers.Authorization)
            window.location.assign('/AffUser')
        })
        .catch((err) => {
            if (err.message !== "Request aborted") {
                if (err.response.data.message === "Invalid user" || err.response.data.message === "Invalid Bearer token")// erreur de token ==> redirection vers la page de change login
                { 
                  console.log("BBBBBBIIIITTTTEEEEEEEEE-----------------------------------------------")
                  window.location.assign('/')
                }
                  else if (err.response.data.message === "User not registered")// ==> redirection vers la page de register
                  window.location.assign('/Change')
                else if(err.response.data.message === "Invalid 2FA token") //erreur de 2FA ==> redirection vers la page de 2FA
                  window.location.assign('/Send2FA')
              }
            console.log(err)
        }
        )
        setCode({code : 0})
    }

    return(
        <div>
            <form className="form" onSubmit={send}>
        <label>
            2FA code
            <input type="number"  value={Code.code} onChange={(e) => setCode({code : parseInt(e.target.value)})} />
        </label>
        <br />
        <button type="submit">Send</button>
        </form>
        </div>


    )
}

export function Resend2FA() {
return (
    <div className="container">
      <h1 className="title">You have to resend your 2FA Code</h1>
     
        <Resend/>
       
    </div>
  );
}