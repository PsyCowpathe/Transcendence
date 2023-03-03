import React, { useState } from 'react';


export const ChatForm = ({ onSendMessage} : any) => {
    const [message, setMessage] = useState('');
  
    const handleSendMessage = (e : any) => {
      e.preventDefault();
      onSendMessage(message);
      setMessage('');
    };
  
    return (
      <form onSubmit={handleSendMessage}>
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
        <button type="submit">Send</button>
      </form>
    );
  };

