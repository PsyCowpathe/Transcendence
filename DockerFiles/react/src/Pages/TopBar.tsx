import React from 'react';
import "../css/List.css"; 
import "../css/NavLink.css"; 
import "../css/TopBar.css"
import MyNavLink from "../style/MynavLink";
import { FaBars} from 'react-icons/fa';

export function TopBar(){
	const [showMenu, setShowMenu] = React.useState(false);
	return (     
		<div className="menu">
				  <button className="menu-toggle">
				  <FaBars />
				</button>
		<li><MyNavLink to="/chat" label="chat"/></li>
		<li><MyNavLink to="/affUser" label="My User page"/></li>
		<li><MyNavLink to="/askFriend" label="demande d ami"/></li>
		</div>
	)
};
