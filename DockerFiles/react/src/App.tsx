import React from 'react';
import logo from './logo.svg';
import './App.css';
import {useEffect } from 'react'
import {useState } from 'react'

//import TryLogin from './Api'
import axios from 'axios';

let uid = "u-s4t2ud-21f144616dae6f0e27670562f16d1b3b8782bbad40c0d1ea5f0d1d54eae9d61f";
let redirect = "http://localhost:3000";
//let redirect = "https://reddit.com";
let random = "dwdadfegthyhgfdASYJTUNBFSDRGW48754454"
const URL: string = `https://api.intra.42.fr/oauth/authorize?client_id=${uid}&redirect_uri=${redirect}&response_type=code&scope=public&state=${random}'`


axios.defaults.withCredentials = true

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
	{
		first_state: urlSearchParams.get('state'),
		code : urlSearchParams.get('code'),
		second_state : urlSearchParams.get('state')}

    if (token) {
      console.log("wesh")
      handleToken(token);
    }
  }

  React.useEffect(() => {
    console.log("wesh")

    handleUrlSearchParams();
  }, []);



  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Ft_trancendence <br/>
        
        <button onClick={handleClick} >BIIITE</button>
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
//   return (
//     <div className="App">
//       <h1>Mon application</h1>
//       <button onClick={handleClick}>Authentification</button>
//     </div>
//   );
// }


// function App() {


// //   const [test , setTest] = useState(1)

// //   const [fruit, setFruit] = useState([
// //     {id: 1, nom :"abricot"},
// //   {id: 2, nom :"banane"},
// //   {id: 3, nom :"cerise"}
// // ])
// // const [data, setdata] = useState([
// //   {name :"abricot", age: 15},
// //   {name :"abricothon", age: 55},
// //   {name :"abricotage", age: 95},
// //   {name :"abricotier", age: 5},

// // ])

   
// useEffect(() => {
//   const urlSearchParams = new URLSearchParams(window.location.search);
//   let token = urlSearchParams.get('code');
  
//   if (token) {
//       const pasresponse = axios.post("http://10.13.7.1:3630/auth/token", token)
//       .then(response => {
//         console.log(response.data);
//       })
//       .catch(error => {
//         console.log(error);
//       });
//   } else {
//     window.location.href = URL;
//   }
// }, []);


  
//   /*function MyComp() {
  
//     useEffect(() => {
//       makeGet();
  
//     }, [test])
//     return(
//       <h1>ssss</h1>
//       //console.log("test")
//     )
//   }*/
  
//   //<button color="0xFF0000" onClick = {makePost} > SEND 😀</button> <br/>
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <h1>Ft_trancendence <br/>
        
//         <button onClick={TryLogin} >BIIITE</button>
//         </h1>
//         <h5>ca c est cheum</h5>
//         <p>
//         on vas test des truc 
//         <a href="https://reactjs.org" > BITE</a>
//         </p>

//       </header>
//     </div>
//   );
// }
 export default App;
