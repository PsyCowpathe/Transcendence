import React from 'react';

interface Message {
  id: number;
  text: string;
}

interface ChatProps {
  messages: Message[];
  
}

export const ChatList = ({ messages }: ChatProps) => {
  return (
    <ul>
      {messages.map((message) => (
        <li key={message.id}>{message.text}</li>
      ))}
    </ul>
  );
};