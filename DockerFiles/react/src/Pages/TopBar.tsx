import React from 'react';
import {BrowserRouter, Route, Routes, Link} from 'react-router-dom';

import {useState, createContext } from 'react'
import LoadingPage from "../Pages/LoadingPage";
import { ChangeLogin } from "../Pages/LoginPage";
// import { Chat } from "./chat/ChatComp";
import "../css/List.css"; 
import "../css/NavLink.css"; 
import "../css/TopBar.css"
import MyNavLink from "../style/MynavLink";
import {AffMyUserPage} from "../Pages/UserPage";
import { AskFriend } from "../Pages/AskFrindPage";
import IconLabelButtons from '../PageTest';
import { useNavigate } from 'react-router-dom'
export function TopBar(){

    const navigate = useNavigate();
    console.log("bite")
    // navigate('/LoadingPage')

    return (
            
        <nav className="topbar">
		<li><MyNavLink to="/change" label="change your login"/></li>
		<li><MyNavLink to="/chat" label="chat"/></li>
		{/* <li><MyNavLink to="/chatoune" label="chatTest"/></li> */}
		<li><MyNavLink to="/affUser" label="My User page"/></li>
		{/* <li><MyNavLink to="/changepic" label="change my pic"/></li> */}
		<li><MyNavLink to="/askFriend" label="demande d ami"/></li>
		{/* <li><MyNavLink to="/test" label="test"/></li> */}
        </nav>


    )
};


