
import Profil from '../imgs/360_F_122719584_A863mvJEcEAnqmGQ4ky6RbXEhsHKw95x.jpg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FaCog } from 'react-icons/fa';
import '../css/Buttons.css';
import { useNavigate } from 'react-router-dom'
import { TopBar } from './TopBar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { urls } from "../global"
import { VraimentIlSaoule2 } from '../aurelcassecouilles/VraimentIlEstCasseCouille';
import { PicGetRequest } from '../Api/PicGetRequest';
import { GetUserInfo } from '../Api/GetUserInfo';
import React from 'react';
import PicModal from '../Modale/PicModale';
import { ChangeLogin } from './LoginPage';
import LoginModal from '../Modale/LoginModal';
import '../css/UserPage.css';
import ModalSet2FA from '../Modale/Modal2FA';
import './test.css'
import { GetFriendList } from '../Api/GetFriendList';


export function AffMyUserPage({ ShowBar }: { ShowBar: boolean })
{
  interface friend
  {
    id: number
    name : string
  }
  const [friends, setFriend] = useState<friend[]>([])
  useEffect(() =>
  {
    GetFriendList()
    .then((res) =>
    {
      console.log("ssss")
      console.log(res)
      setFriend(res.data.map((name:any, index : any) => {
        return { id:  Date.now(), name: name}
      }
      ))
    })
    .catch((err) =>
    {
      if (err.message !== "Request aborted") {
        if (err.response.data.message === "Invalid user" || err.response.data.message === "Invalid Bearer token")// erreur de token ==> redirection vers la page de change login
          window.location.assign('/')
        if (err.response.data.message === "User not registered")// ==> redirection vers la page de register
          window.location.assign('/Change')
        if(err.response.data.message === "Invalid 2FA token") //erreur de 2FA ==> redirection vers la page de 2FA
          window.location.assign('/Send2FA')////////////////////////////////////////////////////////////////////////////////////
      }
    })
  }, [])


  const [ClickLog, setClickLog] = useState(false)
  const [Clickde, setClickde] = useState(false)
  const [Click, setClick] = useState(false)
  const [PicUp, setPic] = React.useState("non")
  const [Pic, setPicUrl] = useState(localStorage.getItem('ProfilPic') || "Profil")
  // setPicUrl(localStorage.getItem('ProfilPic') || "Profil")
  useEffect(() => {
    console.log("Use effect de la photo")
    PicGetRequest()
      .then((res) => {
        console.log("|")
        console.log(res)
        console.log("|")
        const url = window.URL.createObjectURL(new Blob([res.data]));
        localStorage.setItem('ProfilPic', url)
        setPicUrl(url)
        console.log(Pic)
        setPic("oui")
      })
      .catch((err) => {
        console.log("ERROR")
        toast.error(err, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
          progressClassName: "my-progress-bar"
        })
        if (err.message !== "Request aborted") {
          if (err.response.data.message === "Invalid user" || err.response.data.message === "Invalid Bearer token")// erreur de token ==> redirection vers la page de change login
          {
            console.log("coucou ?")
            window.location.assign('/')
            console.log("t s sence te barrer fdp")
          }
          if (err.response.data.message === "User not registered")// ==> redirection vers la page de register
          {
            console.log("ERROR")
            console.log(err)
            window.location.assign('/Change')
          }
          if(err.response.data.message === "Invalid 2FA token") //erreur de 2FA ==> redirection vers la page de 2FA
          {
            console.log("ERROR")
            console.log(err)
            window.location.assign('/Send2FA')////////////////////////////////////////////////////////////////////////////////////
            
          }
        }
      })
  }, [Click])


  const UserName: any = localStorage.getItem('name')
  // console.log(UserName)
  // useEffect(() =>
  // {
  // GetUserInfo(UserName) //je recupere toute les info sur mon user 
  // .then((res) =>
  // {
  //   console.log(res)
  // })
  // .catch((err) =>
  // {
  //   console.log("ICI////////////////////////ICI")
  //   toast.error(err.message, {
  //     position: toast.POSITION.TOP_RIGHT,
  //     autoClose: 2000,
  //     progressClassName: "my-progress-bar"
  // })
  // console.log("============");
  // console.log(err.message)
  // console.log("============");
  // console.log(err.response)
  // console.log("============");
  // // console.log(err.response.data.message)
  // console.log("============");
  // console.log("============");
  //    // 401 --> token invalide 
  //    // 403 --> user non enregistré
  //    if (err.message !== "Request aborted" )
  //    { 
  //    if(err.response.data.message === "Invalid user" || err.response.data.message === "Invalid Bearer token")// erreur de token ==> redirection vers la page de change login
  //     {
  //       console.log("coucou ?")
  //       window.location.assign('/')
  //       console.log("t s sence te barrer fdp")
  //     }
  //     if (err.response.data.message=== "User not registered")// ==> redirection vers la page de register
  //     {
  //       console.log("ERROR")
  //       console.log(err)
  //       window.location.assign('/Change')
  //    }
  //   }
  //    //if(err.message === "Invalid 2FA token") erreur de 2FA ==> redirection vers la page de 2FA

  // })
  // }, [])

  const [redirected, setRedirected] = useState(false)

  useEffect(() => {
    if (redirected) {
      return
    }

    GetUserInfo(UserName)
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log("ICI////////////////////////ICI")
        toast.error(err.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
          progressClassName: "my-progress-bar"
        })
        console.log("============");
        console.log(err.message)
        console.log("============");
        console.log(err.response)
        console.log("============");
        console.log("============");

        if (err.message !== "Request aborted")
        {
          if (err.response.data.message === "Invalid user" || err.response.data.message === "Invalid Bearer token")
          {
            console.log("coucou ?")
            setRedirected(true) // mettre redirected à true après la redirection
            window.location.assign('/')
            console.log("t s sence te barrer fdp")
          }
          else if (err.response.data.message === "User not registered")
          {
            console.log("ERROR")
            console.log(err)
            setRedirected(true) // mettre redirected à true après la redirection
            window.location.assign('/Change')
          }
  //    //if(err.message === "Invalid 2FA token") erreur de 2FA ==> redirection vers la page de 2FA
        }
      })
  }, [redirected])

  const navigate = useNavigate();
  const onClick = (() => {
    console.log("ass")
    setClickLog(!ClickLog)

  })


  const CloseMod = () => {
    console.log("-------------------Q--------------------")
    setClick(!Click)
    console.log(Click)
  };
  
  const [open2FA, setopen2FA] = useState<boolean>(false)
  const set2FA = () =>
  {
    setopen2FA(!open2FA)
  }



  return (
    <div className="user-page">
      <TopBar />
      <div className="user-info">
        <div className="profile-pic-container">
          <img className="profile-pic" src={Pic} alt="Profile" />
          <button className="profile-pic-button" onClick={CloseMod}>
            Change your image
          </button>
          {Click && <PicModal onClose={CloseMod} />}
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
      <div>
        <button onClick={set2FA}>Set 2FA</button>
        {open2FA && <ModalSet2FA onClose={set2FA}/>}
      </div>
      <div className="friends-list">
      <h3>Friends</h3>
      <ul>
        {friends.map((friend) => (
          <li key={friend.id}>{friend.name}</li>
        ))}
      </ul>
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