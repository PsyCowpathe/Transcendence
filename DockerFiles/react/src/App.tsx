import React from 'react';
import logo from './logo.svg';
import './App.css';
import {useState, useEffect} from 'react'
import AuthToken from './Auth'
import axios from 'axios';
let first_states : string | null = "dwdadfegthyhgfdASYJTUNBFSDRGW48754454"

<<<<<<< HEAD
function App() 
{
	interface mabite
=======
let uid = "u-s4t2ud-21f144616dae6f0e27670562f16d1b3b8782bbad40c0d1ea5f0d1d54eae9d61f";
let redirect = "http://localhost:3000";
//let redirect = "https://reddit.com";
let random = "dwdadfegthyhgfdASYJTUNBFSDRGW48754454"
const URL: string = `https://api.intra.42.fr/oauth/authorize?client_id=${uid}&redirect_uri=${redirect}&response_type=code&scope=public&state=${random}'`


function App() {
  const handleClick = () => {
    /*const response = axios.post("http://10.13.7.1:3630/user/create", "token")
    .then(response => {
      console.log("tamere la pas pute")

      console.log(response.data);
    })
    .catch(error => {
      console.log("tamere la cxvzxdcvpute")
      console.log(error);
    });*/

    window.location.href = URL;
  }

  const handleToken = (token : any) => {
    console.log("test")
    const response = axios.post("http://localhost:3630/auth/firstconnect")
	.then(response => {
        console.log("tamere la pas pute")

        console.log(response.data);
      })
      .catch(error => {
        console.log("tamere la pute")
        console.log(error);
      });
  }

  const handleUrlSearchParams = () => {
    console.log("wesddfsh")

    const urlSearchParams = new URLSearchParams(window.location.search);
   // const queryParameters = new URLSearchParams(window.location.search)
   // const token = queryParameters.get("code")
    //const state = queryParameters.get("state")
  
    const token =
>>>>>>> aurel
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
	
