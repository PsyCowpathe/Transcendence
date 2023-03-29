
import Profil from '../imgs/360_F_122719584_A863mvJEcEAnqmGQ4ky6RbXEhsHKw95x.jpg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MyNavLink from '../style/MynavLink';

import React from 'react';
import { FaCog } from 'react-icons/fa';
import '../css/Buttons.css';
import { useNavigate } from 'react-router-dom'
import { TopBar } from './TopBar';



export function AffMyUserPage ()
{
  const UserName : any= localStorage.getItem('name')
  console.log("ssf")
  console.log(UserName)

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
    
    return (
    		<div className="App">
          <TopBar/>


    {/* <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "2em", height: "100vh" }}> */}
        <img src={Profil} alt="Profile" style={{ borderRadius: "50%", width: "200px", height: "200px", objectFit: "cover", boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)" }} />
        <h1 style={{ fontSize: "2.5em", margin: "1em 0 0.5em" }}>{UserName}</h1><button className="SettingsButton" onClick={onClick}>
      <FaCog  className="SettingsButtonIcon" />
    </button>
        <p style={{ fontSize: "1.2em", marginBottom: "1em",  }}>Age | Ville</p>
        <p style={{ fontSize: "1.2em", marginBottom: "1em", textAlign: "center", maxWidth: "600px" }}>hey bro ca va frero </p>
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"><button style={{ fontSize: "1.2em", padding: "0.5em 2em", borderRadius: "5px", backgroundColor: "#4285F4", color: "#FFFFFF", border: "none", boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)", cursor: "pointer" }}>Visiter mon site web</button></a>
        <button onClick={Notif}>NOTIF</button><ToastContainer/>
        </div>
      </div>
    );
  }
  
  
  // export default AffMyUserPage;