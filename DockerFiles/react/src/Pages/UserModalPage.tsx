
import Profil from '../imgs/360_F_122719584_A863mvJEcEAnqmGQ4ky6RbXEhsHKw95x.jpg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MyNavLink from '../style/MynavLink';

import React from 'react';
import { FaCog } from 'react-icons/fa';
import '../css/Buttons.css';
import { useNavigate } from 'react-router-dom'
import { TopBar } from './TopBar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {urls } from "../global"
import { VraimentIlSaoule2 } from '../aurelcassecouilles/VraimentIlEstCasseCouille';
import { PicGetRequest } from '../Api/PicGetRequest';
import { VraimentIlSaoule } from '../aurelcassecouilles/VraimentIlEstCasseCouille';
import Button from '../style/Button';
import { GetUserInfo } from '../Api/GetUserInfo';
import socketManager from '../MesSockets';
interface User {
  name: string;
}

export function AffTheUser({User, Channel} : {User : User, Channel : string  | null}) 
{
  console.log("Channel name")
  console.log(Channel)
    const [ShowBan, setShowBan] = useState<boolean>(false)
    const [timer , setTimer] = useState<number>(0)
    const [reason, setReason] = useState<string>("")
    
    const socket = socketManager.getChatSocket();
  useEffect(() => {

    const handleBanUser = (data : any) => {
      toast.success(data, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        progressClassName: "my-progress-bar"
    })
    }

    const handleBanUsererror = (data : any) => {
      toast.error(data, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        progressClassName: "my-progress-bar"
    })
    }
    socket.on("banuser", handleBanUser);
    socket.on("ChatError", handleBanUsererror);
    return () => {
      socket.off("banuser", handleBanUser);
      socket.off("ChatError", handleBanUsererror);
    };

    }, [])

    useEffect(() => {
    GetUserInfo(User.name)
    .then((res) =>
    {
      console.log("couxcou")
      console.log(User.name)
        console.log(res)
    })
    .catch((err) =>
    {
        console.log(err)
    })
    }, [])


    const [PicUp, setPic] = React.useState("non")
    let Pic : any = localStorage.getItem('ProfilPic')
    if(Pic === null)
    {
      Pic = Profil
    }
    useEffect(() =>
    {
      console.log("Use effect de la photo")
      PicGetRequest()
      .then((res) =>
      {
        console.log("|")
        console.log(res)
        console.log("|")
        const url = window.URL.createObjectURL(new Blob([res.data]));
        localStorage.setItem('ProfilPic', url)
  
        setPic("oui")
      })
      .catch((err) =>
      {
        console.log("ERROR")
        toast.error(err, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
          progressClassName: "my-progress-bar"
      })
      })
    }, [])
  
    useEffect (() =>
    {
      Pic = localStorage.getItem('ProfilPic')
    }, [PicUp])
    
    const UserName : any= localStorage.getItem('name')
    console.log(UserName)
  
 ////////////////////////////////////////////////////////BAN   
    
 const Ban = (e : React.FormEvent<HTMLFormElement>) =>
 {
   e.preventDefault()
   console.log(User)
   console.log(Channel)
   socket.emit("banuser", { name: User.name, channelname: Channel, time: timer, reason: reason })
   setReason("")
   setTimer(0)
   setShowBan(!ShowBan)
   
  }
  const onClickTwo = (() =>
  {
    setShowBan(!ShowBan)
  })


//////////////////////////////////////////////////////MUTE
const Mute =  (e : React.FormEvent<HTMLFormElement>) =>
{
  e.preventDefault()
  if (Channel !== '')
    socket.emit("muteuser", { name: User.name, channelname: Channel, time: timer, reason: reason })
  // else 
  //   socket.emit("muteuser", { name: User, channelname: Channel, time: timer, reason: reason })
  setReason("")
  setTimer(0)
  setShowMute(!ShowMute)

}

const [ShowMute, setShowMute] = useState<boolean>(false)
const onClickTree = (() =>
{
  setShowMute(!ShowMute)
})

//////////////////////////////////////////////////////KICK
// -kickuser (nom de l’user a kick, nom du channel, raison)
const Kick =  (e : React.FormEvent<HTMLFormElement>) =>
{
  e.preventDefault()
  if (Channel !== '')
    socket.emit("kickuser", { name: User.name, channelname: Channel, reason: reason })
  // else 
  //   socket.emit("muteuser", { name: User, channelname: Channel, time: timer, reason: reason })
  setReason("")
  setShowKick(!ShowKick)

}

const [ShowKick, setShowKick] = useState<boolean>(false)
const onClickfour = (() =>
{
  setShowKick(!ShowKick)
})

const navigate = useNavigate();



return(
    <div className="App">

 <img src={Pic} alt="Profile" style={{ borderRadius: "50%", width: "200px", height: "200px", objectFit: "cover", boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)" }} />
  <h1 style={{ fontSize: "2.5em", margin: "1em 0 0.5em" }}>{User.name}</h1>
  <p style={{ fontSize: "1.2em", marginBottom: "1em",  }}>Age | Ville</p>
  <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
    <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"><button style={{ fontSize: "1.2em", padding: "0.5em 2em", borderRadius: "5px", backgroundColor: "#4285F4", color: "#FFFFFF", border: "none", boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)", cursor: "pointer" }}>Visiter mon site web</button></a>
  {!ShowBan && <button className="add-message-button" onClick={onClickTwo}>Ban</button>}
      {ShowBan && 
      <div>

      <form  onSubmit={Ban}>
      <input type="text" placeholder="reason" value={reason} onChange={(e) => {setReason(e.target.value)}} />
      <input type="texte" placeholder="0" value={timer} onChange={(e) => {setTimer(parseInt(e.target.value))}} />
      <button className="add-message-button" >Ban</button>
      </form>
    </div>
      } 
  {!ShowMute && <button className="add-message-button" onClick={onClickTree}>Mute</button>}
     {ShowMute && 
      <div>
      <form  onSubmit={Mute}>
      <input type="text" placeholder="reason" value={reason} onChange={(e) => {setReason(e.target.value)}} />
      <input type="texte" placeholder="0" value={timer} onChange={(e) => {setTimer(parseInt(e.target.value))}} />
      <button className="add-message-button">Mute</button>
      </form>
    </div>
      } 
      {!ShowKick && <button className="add-message-button" onClick={onClickfour}>Kick</button>}
     {ShowKick && 
      <div>
      <form  onSubmit={Kick}>
      <input type="text" placeholder="reason" value={reason} onChange={(e) => {setReason(e.target.value)}} />
      <button className="add-message-button">Kick</button>
      </form>
    </div>
      } 


  </div><ToastContainer/>
</div>
);
}