
import { NavLink } from "react-router-dom";

import './App.css';
import {useState, useEffect} from 'react'
import AuthToken from './Auth'
import axios from 'axios';
import { CookiesProvider, useCookies } from "react-cookie";
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { HomePage } from './Pages/HomePage';
import { AuthRedirectionPage } from './Pages/AuthRedirect';
import { ChangeLogin } from "./Api/changeLogin";
import LogOutPage from './Pages/loginPage';
import { Chat } from "./chat/ChatComp";
let first_states : string | null = "dwdadfegthyhgfdASYJTUNBFSDRGW48754454"

function App() 
{
    const [login, setLogin] = useState("")

	const [cookies, setCookie] = useCookies(['token']);

	interface mabite
	{
		code : string | null;
		state : string | null
	}
	
	const [token, setToken] = useState<mabite>({state: null, code: null})

	
	//ade3b5ea214ca737f53ce0bce98938c2.jpg
	return (
		<BrowserRouter>
		<li><NavLink to="/">Login</NavLink></li>
		<li><NavLink to="/change">change your login</NavLink></li>
		<li><NavLink to="/chat">chat</NavLink></li>
			<Routes>
			<Route path='/' element={<HomePage  token={token} setToken={setToken}/>}/>
			<Route path='/change' element={<ChangeLogin login={login} setLogin={setLogin}/>}/>
			<Route path='/chat' element={<Chat/>}/>
			</Routes>
		</BrowserRouter>
		
		);
}
	
	export default App;
	


	// <div className="App">
	// 	<header className="App-header">
	// 	<img src={logo} className="App-logo" alt="logo" />
	// 	<Route path='/Pages/' element="HomePage"/>
	// 	<h1>Ft_trancendence <br/>
	// /*		<AuthToken token={token} setToken={setToken} setCookie={setCookie} cookies={cookies}/>
	// 		<button onClick={getAuth}>tssss</button>*/
	// 	</h1>
		
	// 	<h5>ca c est cheum</h5>
	// 	<p>
	// 	on vas test des truc 
	// 	<a href="https://reactjs.org" > BITE</a>
	// 	</p>
	// 	</header>
	// 	</div>