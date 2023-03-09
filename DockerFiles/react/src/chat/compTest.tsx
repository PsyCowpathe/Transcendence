import React, { useState, useEffect } from "react";
import "./chat.css";
import {socketManager} from "../Pages/HomePage";
import { VraimentIlSaoule } from "../aurelcassecouilles/VraimentIlEstCasseCouille";
let test : boolean = false
let socket: any


interface ChatMessage {
  username: string;
    message: string;
  }
  
  interface ChatProps {
    username: string;
  }
  export function Chat( username : ChatProps){
   socket = socketManager.getChatSocket()
    
    console.log("je suis null1")
    
    if (socket == null)
    { 
      console.log("je suis null2")
    if ( test === false && VraimentIlSaoule().headers.Authorization !== null)
    {
      console.log("je suis null3")
      socket = socketManager.initializeChatSocket(VraimentIlSaoule().headers.Authorization)
      console.log(socket )
      
      test = true
    }
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

     