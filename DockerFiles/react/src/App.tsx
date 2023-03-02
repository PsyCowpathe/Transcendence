


import './App.css';
import {useState, useEffect} from 'react'
import AuthToken from './Auth'
import axios from 'axios';
import { CookiesProvider, useCookies } from "react-cookie";
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { HomePage } from './Pages/HomePage';
import { AuthRedirectionPage } from './Pages/AuthRedirect';
let first_states : string | null = "dwdadfegthyhgfdASYJTUNBFSDRGW48754454"

function App() 
{
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
			<Routes>
			<Route path='/' element={<HomePage cookie={cookies} setCookie={setCookie} token={token} setToken={setToken}/>}/>
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