import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./chat.css";
import { urls } from '../global'

const socket = io("http://10.13.7.1:3631/"); // Connecter à l'instance Socket.IO

interface ChatMessage {
  username: string;
  message: string;
}

interface ChatProps {
  username: string;
}

export function Chat( username : any){
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  
  useEffect(() => {
    console.log("biiiite2")

    // écoute l'événement de réception de message depuis le serveur
    socket.on("events", (message: ChatMessage) => {
      setMessages([...messages, message]);  
      console.log(message)
    });
  }, [messages]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputValue) {
      const message = {
        username,
        message: inputValue,
      };
    console.log("biiiite")

      // Envoie le message au serveur
      socket.emit("events", message);
      setInputValue("");
    }
  };

  return (
    <div style={{height: "100vh"}}className="chat-container">
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

// export de Chat;
