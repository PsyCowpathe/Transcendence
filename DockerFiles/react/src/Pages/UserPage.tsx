
import Profil from '../imgs/360_F_122719584_A863mvJEcEAnqmGQ4ky6RbXEhsHKw95x.jpg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FaCog } from 'react-icons/fa';
import '../css/Buttons.css';
import { useNavigate } from 'react-router-dom'
import { TopBar } from './TopBar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {urls } from "../global"
import { VraimentIlSaoule2 } from '../aurelcassecouilles/VraimentIlEstCasseCouille';
import { PicGetRequest } from '../Api/PicGetRequest';
import { GetUserInfo } from '../Api/GetUserInfo';
import React from 'react';
import PicModal from '../Modale/PicModale';
import { ChangeLogin } from './LoginPage';
import LoginModal from '../Modale/LoginModal';
import '../css/UserPage.css';



export function AffMyUserPage ({ShowBar} : {ShowBar : boolean})
{
  const [ClickLog, setClickLog] = useState(false)
  const [Clickde, setClickde] = useState(false)
  const [Click, setClick] = useState(false)
  const [PicUp, setPic] = React.useState("non")
  const [Pic, setPicUrl] = useState(localStorage.getItem('ProfilPic') || "Profil")
  // setPicUrl(localStorage.getItem('ProfilPic') || "Profil")
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
      setPicUrl(url)
      console.log(Pic)
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
  
  
  const UserName : any= localStorage.getItem('name')
  // console.log(UserName)
  useEffect(() =>
  {
  GetUserInfo(UserName) //je recupere toute les info sur mon user 
  .then((res) =>
  {
    console.log(res)
  })
  .catch((err) =>
  {
    toast.error(err, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
      progressClassName: "my-progress-bar"
  })

      if(err.response.data.message == "Invalid user" || err.message.data.message === "Invalid Bearer token")// erreur de token ==> redirection vers la page de change login
      {
        console.log("coucou ?")
        window.location.assign('/')
      }
      if ( err.message === "User not registered")// ==> redirection vers la page de register
      {
        console.log("ERROR")
        console.log(err)
        window.location.assign('/Change')
     }
     // if(err.message === "Invalid 2FA token") erreur de 2FA ==> redirection vers la page de 2FA

      console.log(err.response.data.message)
  })
  }, [])

  const navigate = useNavigate();
  const onClick = (() =>
  {
    console.log("ass")
    setClickLog(!ClickLog)

  })


    const Notif = () => {
      console.log("-------------------Q--------------------")
      setClick(!Click)
    
      console.log(Click)

    };


return (
  <div className="user-page">
    <TopBar />
    <div className="user-info">
      <div className="profile-pic-container">
        <img className="profile-pic" src={Pic} alt="Profile" />
        <button className="profile-pic-button" onClick={Notif}>
          Change your image
        </button>
        {Click && <PicModal onClose={Notif} />}
      </div>
      <div className="user-details">
        <h1 className="user-name">{UserName}</h1>
        <p className="user-age-ville">Age | Ville</p>
        <button className="settings-button" onClick={onClick}>
          <FaCog className="settings-button-icon" />
          <span>Change your login</span>
        </button>
        {ClickLog && <LoginModal onClose={onClick} />}
      </div>
    </div>
    <div className="user-buttons">
      <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="user-button">
        Visiter mon site web
      </a>
    </div>
  </div>
);

  // return (
  //   <div className="App">
  //     {ShowBar && <TopBar />}

  //     {/* <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "2em", height: "100vh" }}> */}
  //     <img src={Pic} alt="Profile" style={{ borderRadius: "50%", width: "200px", height: "200px", objectFit: "cover", boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)" }} />
  //     <h1 style={{ fontSize: "2.5em", margin: "1em 0 0.5em" }}>{UserName}</h1>
  //     <button className="SettingsButton" onClick={onClick}>
  //       <h2>Change yor login</h2>
  //       <FaCog className="SettingsButtonIcon" />
  //     </button>
  //     {ClickLog && <LoginModal onClose={onClick} />}
  //     <p style={{ fontSize: "1.2em", marginBottom: "1em", }}>Age | Ville</p>
  //     <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
  //       <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"><button style={{ fontSize: "1.2em", padding: "0.5em 2em", borderRadius: "5px", backgroundColor: "#4285F4", color: "#FFFFFF", border: "none", boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)", cursor: "pointer" }}>Visiter mon site web</button></a>
  //       <button onClick={Notif}>Change your image</button>
  //       {Click && <PicModal onClose={Notif} />}

  //     </div><ToastContainer />
  //   </div>
  // );
  }
  
  
  // export default AffMyUserPage;