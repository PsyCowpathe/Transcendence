import React, { useState } from 'react';
import { ChatList } from './ChatList';
import { ChatForm } from './ChatForm';
interface Message {
  id: number;
  text: string;
}

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = (messageText: string) => {
    const newMessage = {
      id: Date.now(),
      text: messageText,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  return (
    <div style={{ height: "100vh"}}>
      <ChatList messages={messages} />
      <ChatForm onSendMessage={handleSendMessage} />
    </div>
  );
};
