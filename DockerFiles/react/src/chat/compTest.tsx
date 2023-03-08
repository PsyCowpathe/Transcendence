import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./chat.css";
import { urls } from '../global'
import { VraimentIlSaoule } from "../aurelcassecouilles/VraimentIlEstCasseCouille";
import SocketManager from "../MesSockets";
let socket : any
// let config : any
let test : boolean = false
// const config = VraimentIlSaoule().headers.Authorization
// const socket = io("http://10.14.2.7:3631/",  {
//   auth:
//   {
//     token : config
//   },
//   // reconnection: true,
// }); // Connecter à l'instance Socket.IO

  interface ChatMessage {
    username: string;
    message: string;
  }

interface ChatProps {
  username: string;
}
export function Chat( username : ChatProps){

  if (test === false)
  {
  //    config = VraimentIlSaoule().headers.Authorization
  //    socket = io("http://10.14.2.7:3631/",  {
  //     auth:
  //     {
  //       token : config
  //     },
  //     // reconnection: true,
  //   }); // Connecter à l'instance Socket.IO
  console.log("sadasdasfadsgfbhjasdf-----------------------------")
  const socketManager = new SocketManager();
   socket = socketManager.getSocket1(); 
    test = true    
  }
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  
  useEffect(() => {
    console.log("biiiite2")
     
    // écoute l'événement de réception de message depuis le serveur
    socket.on("events", (message: ChatMessage) => {
      setMessages([...messages, message]);  
      console.log("la rep :")
      console.log(messages)
    });
    
   
  }, [messages]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputValue) {
      const message = {
        username : username.username,
        message: inputValue,
      };
      console.log(`le user ${message.username}`)
      console.log("biiiite")
      
      // console.log(`config ${config}`)
      // Envoie le message au serveur
     // let reponse : any ;
      console.log(`je send ${message.message}`)
      await socket.emit("events", message);
      //console.log(`reponse : ${reponse.data}`)
      setInputValue("");
    }
  };
    
  return (
    <div style={{height: "50vh"}}className="chat-container">
      <div className="messages-container">
        {messages.map((message, index) => (
          <div className="message" key={index}>
            <span className="username">{message.username}: </span>
            <span className="text">{message.message}</span>
          </div>
        ))}
      </div>
      <form className="input-form" onSubmit={handleSubmit}>
        <input
          className="input"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter a message"
        />
        <button className="send-button" type="submit">
          Send
        </button>
      </form>
    </div>
  );
};

     