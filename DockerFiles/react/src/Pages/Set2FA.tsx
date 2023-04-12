import QRCode from 'qrcode.react';
import * as OTPAuth  from 'otpauth';
import { Get2FA } from '../Api/Get2FA';
import LoadingPage from './LoadingPage';
import React, { Component } from 'react';
import { useState } from 'react';
import { VraimentIlSaoule } from '../aurelcassecouilles/VraimentIlEstCasseCouille';
import axios from 'axios';
import { urls } from '../global';
import { TopBar } from './TopBar';
import { Send2FA } from '../Api/send2FA';
import { socketManager } from './HomePage';
interface MyComponentState {
  image: string | null;
  error: Error | null;
}


interface code {
  code : number
}
export function Set2FA ()
{
  const [Code2FA , setCode2FA] = useState<code>({code : 0})
  const HandleCode = (e : any) =>
  {
    e.preventDefault()
    let config = VraimentIlSaoule()
    console.log("-------------------------------QQQQAAA---------------------------------------------------")
    console.log(Code2FA)
    Send2FA(Code2FA)
    .then((res) =>
    {
    console.log("--------FF-----------------------QQQQAAA---------------------------------------------------")

    console.log(res.data.newFA)
    localStorage.setItem('2FA', res.data.newFA)
    socketManager.initializeChatSocket(VraimentIlSaoule().headers.Authorization)
			socketManager.initializeFriendRequestSocket(VraimentIlSaoule().headers.Authorization)
    })
    .catch((err) =>
    {
      console.log(err)
    })
    console.log("pour aurel")

     setCode2FA({code : 0})
  }


  return(
      <div>
        <TopBar />
    <MyComponent/>

 <form style={{display:"flex", margin:"20vh", justifyContent:"center", alignItems: "center"}} onSubmit={HandleCode}>
    <input type="texte" placeholder="0" value={Code2FA.code} onChange={(e) => setCode2FA({code : parseInt(e.target.value)})} />
    <button>Send 2FA</button>
    </form>
    </div>
  )
}
export class MyComponent extends Component <{}, MyComponentState>
{

  constructor(props : any) 
  {
    super(props);
    this.state = {
      image: null,
      error: null
    };
    this.handleClick = this.handleClick.bind(this);
    this.PutainLeFdp = this.PutainLeFdp.bind(this);
  }


  

  // const [verif, setVerif] = useState(false)

  handleClick() {
    this.PutainLeFdp();
  }
  PutainLeFdp = () =>
  {
    console.log("----------------------------------------------------------------------------------")
 
    Get2FA()
  .then((res) =>
  {
    console.log("SSSSSSSSSSSSSSSSS----------------------------------------------------------------------------------")
    console.log(res.data)
    let uri = new OTPAuth.URI()
    uri = res.data

    this.setState({ image: res.data, error: null });
  })
  .catch((err) =>
  {
    this.setState({ image: null, error: err.response.data });
    console.log(err)
    if (err.message !== "Request aborted") {
      if (err.response.data.message === "Invalid user" || err.response.data.message === "Invalid Bearer token")// erreur de token ==> redirection vers la page de change login
        window.location.assign('/')
      if (err.response.data.message === "User not registered")// ==> redirection vers la page de register
        window.location.assign('/Change')
      if(err.response.data.message === "Invalid 2FA token") //erreur de 2FA ==> redirection vers la page de 2FA
        window.location.assign('/Send2FA')
    }
  })
  }

  render(){
    const { image, error } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    }
    if (!image) {
      
      return(
        <div>
          
        <button onClick={this.handleClick}>active 2FA</button>
        {/* <LoadingPage/>; */}
        </div>
      )
    }
    return(
      <div>
  
  <QRCode style={{display:"flex", justifyContent:"center", alignItems: "center", width: "100%", height: "100%", objectFit: "cover"}}
 value={image} />
 
      {/* <button onClick={this.handleClick}>coucouFDP</button> */}
  
{/*   
      <form onSubmit={pouraurel}>
      <input type="texte" placeholder="0" value={timer.code} onChange={(e) => setTimer({code : parseInt(e.target.value)})} />
  <button >coucou</button>
      </form>
      {verif && <img src={pic2} alt="TAMERE"  />}
    */}
      </div> 
    )

  }

  
}
      
// <button onClick={SetClick}>salam fdp</button>
// {Click && <MyComponent/>}



