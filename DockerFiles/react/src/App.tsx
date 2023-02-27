import React from 'react';
import logo from './logo.svg';
import './App.css';
import AuthToken from './Auth'
import axios from 'axios';
let first_states : string | null = "dwdadfegthyhgfdASYJTUNBFSDRGW48754454"

function App() 
{
	interface mabite
	{
		first_state : string|null;
		code : string | null;
		second_state : string | null
	}

	const [token, setToken] = useState<mabite>({first_state : first_states, code : null,  second_state: null})
	
	return (
		<div className="App">
		<header className="App-header">
		<img src={logo} className="App-logo" alt="logo" />
		<h1>Ft_trancendence <br/>
		<AuthToken token={token} setToken={setToken}/>
		</h1>
		<h5>ca c est cheum</h5>
		<p>
		on vas test des truc 
		<a href="https://reactjs.org" > BITE</a>
		</p>
		
		</header>
		</div>
		);
}
	
	export default App;
	
