
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
interface User {
  name: string;
}

export function AffTheUser({MyName} : {MyName : User})
{
    const [ShowBan, setShowBan] = useState<boolean>(false)
    const [timer , setTimer] = useState<number>(0)
    const [reason, setReason] = useState<string>("")
    

    useEffect(() => {
    GetUserInfo(MyName.name)
    .then((res) =>
    {
      console.log("coucou")
      console.log(MyName.name)
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
  









const Ban = (e : any) =>
{
  e.preventDefault()
  // alert("bim t es ban fdp" + UserName)
  // socket.emit("banuser", { name: UserName, channelname: "coucou", time: timer, reason: reason })
}

const BanUser = () => {

  return (
    <div>

      <form action="onSubmit" onSubmit={Ban}>
      <input type="text" placeholder="why?" value={reason} onChange={(e) => setReason(e.target.value)} />
      <input type="number" placeholder="12" value={timer} onChange={(e) => setTimer(parseInt(e.target.value))} />
      <button className="add-message-button" >Ban</button>
      </form>
    </div>
  )
}

const navigate = useNavigate();
const onClick = (() =>
{
  console.log("pkkkkkkkkkkkkkkkkkkkkkkkk")
   navigate('/change');
})

const OpenBan = () =>
{
  if (ShowBan === false)
    setShowBan(true)
  else 
    setShowBan(false)
}

 

return(
    <div className="App">

 <img src={Pic} alt="Profile" style={{ borderRadius: "50%", width: "200px", height: "200px", objectFit: "cover", boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)" }} />
  <h1 style={{ fontSize: "2.5em", margin: "1em 0 0.5em" }}>{UserName}</h1><button className="SettingsButton" onClick={onClick}>
<FaCog  className="SettingsButtonIcon" />
</button>
  <p style={{ fontSize: "1.2em", marginBottom: "1em",  }}>Age | Ville</p>
  <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
    <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"><button style={{ fontSize: "1.2em", padding: "0.5em 2em", borderRadius: "5px", backgroundColor: "#4285F4", color: "#FFFFFF", border: "none", boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)", cursor: "pointer" }}>Visiter mon site web</button></a>
  <button onClick={OpenBan}>Ban</button>
      {ShowBan && <BanUser/>} 

  </div><ToastContainer/>
</div>
);


}