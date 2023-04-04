
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



function Tamere()
{
  const [verif, setVerif] = useState(false)
  const PutainLeFdp = () =>
  {
    console.log("----------------------------------------------------------------------------------")
    let config : any= VraimentIlSaoule2()
  axios.get(`${urls.SERVER}/auth/set2FA`, config)
  .then((res) =>
  {
    console.log("SSSSSSSSSSSSSSSSS----------------------------------------------------------------------------------")
    console.log(res.data)

    const url = window.URL.createObjectURL(new Blob([res.data]));
    localStorage.setItem('QR', url)
    setVerif(true)
  })
  .catch((err) =>
  {
    console.log(err)
  })


  }

  interface code {
    code : number
  }
  const [timer, setTimer] = useState<code>({code : 0})
  const pouraurel = (e : any) =>
  {
    e.preventDefault()
    console.log(timer.code)
    let config = VraimentIlSaoule()
    console.log("-------------------------------QQQQAAA---------------------------------------------------")
    axios.post(`${urls.SERVER}/auth/2FAlogin`, timer, config)
    .then((res) =>
    {
    console.log("--------FF-----------------------QQQQAAA---------------------------------------------------")

      console.log(res)
    })
    .catch((err) =>
    {
      console.log(err)
    })
    console.log("pour aurel")
    setTimer({code : 0})
  }
  const pic2 : any = localStorage.getItem('QR')
  // const pic2 = localStorage.getItem('QR') + "?t=" + new Date().getTime();
  return(
    <div>

    <button onClick={PutainLeFdp}>coucouFDP</button>


    <form onSubmit={pouraurel}>
    <input type="texte" placeholder="0" value={timer.code} onChange={(e) => setTimer({code : parseInt(e.target.value)})} />
<button >coucou</button>
    </form>
    {verif && <img src={pic2} alt="TAMERE"  />}
    </div>
  )
  
}

export function AffMyUserPage ({ShowBar} : {ShowBar : boolean})
{
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
  // console.log(UserName)
  useEffect(() =>
  {
  GetUserInfo(UserName) //je recupere toute les info sur mon user 
  .then((res) =>
  {
    console.log("coucou")
    console.log(UserName)
    console.log(res)
  })
  .catch((err) =>
  {
      console.log(err)
  })
  }, [])


  const navigate = useNavigate();
  const onClick = (() =>
  {
    console.log("pkkkkkkkkkkkkkkkkkkkkkkkk")
     navigate('/change');
  })


  const handleNotificationClick = () => {
    // Naviguer vers une autre page
    navigate('/changepic')
  };

    const Notif = () => {
      // afficher une notification de succès
      toast.success('Success Notification !', {
        position: toast.POSITION.TOP_RIGHT,
        onClick: handleNotificationClick
    });
    };

const [Click, setClick] = useState(false)

    const SetClick = (() =>
    {
      setClick(!Click)
    })

    return (
    		<div className="App">
          {ShowBar && <TopBar/>}
      
      <button onClick={SetClick}>salam fdp</button>
        {Click && <Tamere/>}
    {/* <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "2em", height: "100vh" }}> */}
        <img src={Pic} alt="Profile" style={{ borderRadius: "50%", width: "200px", height: "200px", objectFit: "cover", boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)" }} />
        <h1 style={{ fontSize: "2.5em", margin: "1em 0 0.5em" }}>{UserName}</h1><button className="SettingsButton" onClick={onClick}>
      <FaCog  className="SettingsButtonIcon" />
    </button>
        <p style={{ fontSize: "1.2em", marginBottom: "1em",  }}>Age | Ville</p>
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"><button style={{ fontSize: "1.2em", padding: "0.5em 2em", borderRadius: "5px", backgroundColor: "#4285F4", color: "#FFFFFF", border: "none", boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)", cursor: "pointer" }}>Visiter mon site web</button></a>
        <button onClick={Notif}>NOTIF</button>

        </div><ToastContainer/>
      </div>
    );
  }
  
  
  // export default AffMyUserPage;