import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import {useEffect } from 'react'
import {useState } from 'react'


function App() {
  const [test , setTest] = useState(1)

  const [fruit, setFruit] = useState([
    {id: 1, nom :"abricot"},
  {id: 2, nom :"banane"},
  {id: 3, nom :"cerise"}
])
const [data, setdata] = useState([
  {name :"abricot", age: 15},
  {name :"abricothon", age: 55},
  {name :"abricotage", age: 95},
  {name :"abricotier", age: 5},

])


  const makeGet = async () => {
   
      const response =  axios.get("http://10.13.7.1:3630/oui")
     .then((json) =>
      {
        console.log("merci charles")
        console.log(json);
        //console.log(json.data);
      })
      .catch ((err) =>
      {
        console.log("ptn c est la faute d aurel")
        alert(err.message)
        return (err);
      });
    }
  const makePost = async () => {
      const pasresponse = axios.post("http://10.13.7.1:3630/send", {age: 1000251215612348612})
      .then((json) =>
      {
        console.log("ca envois")
      })
      .catch((err) =>
      {
        console.log("ca envois pas")

        alert(err.message)
        return(err);
      });
  /*    // console.log(response)
      console.log("pas error")
    } catch (error : any){
      console.log("error")s
      console.log(error.message);
    }*/
    
  }
  
  function MyComp() {
  
    useEffect(() => {
      makeGet();
  
    }, [test])
    return(
      <h1>ssss</h1>
      //console.log("test")
    )
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>My comp <br/>
        <button onClick = {makePost}>SEND</button> <br/>
        <button onClick = {makeGet}>RECIEVED</button>
        </h1>
        <p>
          Edit <code>src/Apagrasfp.tsx</code> and save to reload.
        </p>

      </header>
    </div>
  );
}

export default App;
