import { useState, useEffect } from "react";
import React from "react";
import '../css/index.css'
import Logo from '../imgs/chargement.png'
import { TopBar } from "./NavBar";
import { useNavigate } from "react-router-dom";
function LoadingPage() {


  useEffect(() => {
    const timeout = setTimeout(() => {
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

    return (
        <div>
          <TopBar/>
        <div className="loading-container" style={{height:"100vh"}}>
        <img src={Logo} alt="Loading" className="loading-logo" />
        <div className="loading-text">Loading...</div>
      </div>
        </div>
    )
    
  
}

export default LoadingPage;
