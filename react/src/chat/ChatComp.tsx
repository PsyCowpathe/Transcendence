import React, { useState } from 'react';
import { ChatList } from './ChatList';
import { ChatForm } from './ChatForm';
import { ToastContainer, toast } from 'react-toastify';
import '../css/index.css'

interface Message {
  id: number;
  text: string;
}

export const Chati = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = (messageText: string) => {
    const newMessage = {
      id: Date.now(),
      text: messageText,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    toast.success('Message send!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 1000, 
      progressClassName : "my-progress-bar"
    });

  };

  return (
    <div style={{ height: "100vh"}}>
      <ChatList messages={messages} />
      <ChatForm onSendMessage={handleSendMessage} /><ToastContainer/>
    </div>
  );
};
