
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
      console.log("coucou")
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
  
const handleReasonChange = (e : React.ChangeEvent<HTMLInputElement>) =>
{
  setReason(e.target.value)
}
const handleTimeChange = (e : React.ChangeEvent<HTMLInputElement>) =>
{
  setTimer(parseInt(e.target.value))
}

const Ban = (e : React.FormEvent<HTMLFormElement>) =>
{
  e.preventDefault()
  alert("bim t es ban fdp" + UserName)
  socket.emit("banuser", { name: UserName, channelname: Channel, time: timer, reason: reason })
  setReason("")
  setTimer(0)
}



const onClickTwo = (() =>
{
  setShowBan(!ShowBan)
})

const navigate = useNavigate();
const onClick = (() =>
{
  console.log("pkkkkkkkkkkkkkkkkkkkkkkkk")
   navigate('/change');
})


return(
    <div className="App">

 <img src={Pic} alt="Profile" style={{ borderRadius: "50%", width: "200px", height: "200px", objectFit: "cover", boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)" }} />
  <h1 style={{ fontSize: "2.5em", margin: "1em 0 0.5em" }}>{User.name}</h1>
  <p style={{ fontSize: "1.2em", marginBottom: "1em",  }}>Age | Ville</p>
  <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
    <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"><button style={{ fontSize: "1.2em", padding: "0.5em 2em", borderRadius: "5px", backgroundColor: "#4285F4", color: "#FFFFFF", border: "none", boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)", cursor: "pointer" }}>Visiter mon site web</button></a>
  <button onClick={onClickTwo}>Ban</button>
      {ShowBan && 
      <div>

      <form  onSubmit={Ban}>
      <input type="text" placeholder="reason" value={reason} onChange={(e) => {setReason(e.target.value)}} />
      <input type="texte" placeholder="0" value={timer} onChange={(e) => {setTimer(parseInt(e.target.value))}} />
      <button className="add-message-button" >Ban</button>
      </form>
    </div>
      } 

  </div><ToastContainer/>
</div>
);
}