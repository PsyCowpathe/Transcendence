import React from 'react';
import "../css/List.css"; 
import "../css/NavLink.css"; 
import "../css/TopBar.css"
import MyNavLink from "../style/MynavLink";
import { FaBars} from 'react-icons/fa';

export function TopBar(){
    return (     
		<div className="menu">
				  <button className="menu-toggle" > 
				  <FaBars />
				</button>
			
        {/* <nav className="navbar"> */}
		<li><MyNavLink to="/change" label="change your login"/></li>
		<li><MyNavLink to="/changepic" label="change picture"/></li>
		<li><MyNavLink to="/chat" label="chat"/></li>
		{/* <li><MyNavLink to="/chatoune" label="chatTest"/></li> */}
		<li><MyNavLink to="/affUser" label="My User page"/></li>
		{/* <li><MyNavLink to="/changepic" label="change my pic"/></li> */}
		<li><MyNavLink to="/askFriend" label="demande d ami"/></li>
		<li><MyNavLink to="/UserTest" label=" testUser"/></li>
		{/* <li><MyNavLink to="/test" label="test"/></li> */}
        {/* </nav> */}
		</div>


    )
};



