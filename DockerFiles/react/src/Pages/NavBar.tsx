import React from 'react';
import "../css/List.css"; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../css/NavLink.css"; 
import "../css/TopBar.css"
import MyNavLink from "../style/MynavLink";

export function TopBar(){
	const [showMenu, setShowMenu] = React.useState(false);
	return (     
		<div className="menu">

		<li><MyNavLink to="/chat" label="chat"/></li>
		<li><MyNavLink to="/affUser" label="My User page"/></li>
		<li><MyNavLink to="/pong/menu" label="pong"/></li>

		</div>
	)
};