import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./truc.css";
import { socketManager } from "../Pages/HomePage";
import { VraimentIlSaoule } from "../aurelcassecouilles/VraimentIlEstCasseCouille";
import { TopBar } from "../Pages/TopBar";
import { ToastContainer, toast } from 'react-toastify';

let test: boolean = false
let socket: any


interface ChanEmit {
  name: string;
  visibility: string;
  password: string | undefined;
}
interface Chati {
  id: number;
  name: string;
}

interface Message {
  id : number;
  user: string;
  text: string;
  isSent: boolean;
}


export function Chat() {
  ////////////////////////////////////////////////////////////////////// chan manager //////////////////////////////////////////////////////////////////
  const [responses, setResponse] = useState<string>("vide");
  const [Chanlist, setChanlist] = useState<Chati[]>([]);
  const [Channame, setChanname] = useState<string>('');
  const [ChanMdp, setChanMdp] = useState<string>('');
  const [newMessage, setNewMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);


  socket = socketManager.getChatSocket()

  if (socket == null) {
    if (test === false && VraimentIlSaoule().headers.Authorization !== null) {
      socket = socketManager.initializeChatSocket(VraimentIlSaoule().headers.Authorization)
      console.log(socket)
      test = true
    }
  }


  useEffect(() => {
    const handleCreateChannel = (response: any) => {
      console.log("response")
      toast.success(response, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        progressClassName: "my-progress-bar"
      })
      setResponse("dont change");
    }
    const handleCreateChannels = (response: any) => {
      console.log(response)
      toast.error(response, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        progressClassName: "my-progress-bar"
      })
      // console.log("coucou jsuis sence rentrer")
      setResponse("change");
    }

    socket.on("createchannel", handleCreateChannel);
    socket.on("ChatError", handleCreateChannels);

    return () => {
      socket.off("createchannel", handleCreateChannel);
      socket.off("ChatError", handleCreateChannels);
    }
  }, [])
  const Channels = (e: any) => {
    //case cocher

    e.preventDefault();
    if (Channame === '') {
      toast.error('Channel name is empty', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
        progressClassName: "my-progress-bar"
      });
      return
    }
    socket.emit("createchannel", { channelname: Channame, visibility: "private", password: undefined })
  }

  const ChannelsMdp = async (e: any) => {
    //case non cocher
    console.log("test")
    e.preventDefault();

    if (Channame === '') {
      toast.error('Channel name is empty', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
        progressClassName: "my-progress-bar"
      });
      return
    }
    socket.emit("createchannel", { channelname: Channame, visibility: "public", password: ChanMdp })
  }
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    if (responses !== "change") {
      console.log("je use effect")
      setChanlist([...Chanlist, { id: Chanlist.length + 1, name: Channame }]);
    }
    setChanname('')
    setChanMdp('')
    setResponse("vide")
  }, [responses])


  /////////////////////////////////////////////////////////////////////////message manager///////////////////////////////////////////


  useEffect(() => {
    const handlelistenMsg = (response: any) => {
      toast.success(response, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        progressClassName: "my-progress-bar"
      })
      setMessages([...messages, {id:1, user: response.user, text: response.text, isSent: false }]);
    }

    socket.on("chatmsg", handlelistenMsg);

    return () => {
      socket.off("chatmsg", handlelistenMsg);
    }
  }, [])
 
  
  const testiii = () => {
    setMessages([...messages, { id: messages.length + 1, user: "l autre", text: "baleck  frere", isSent: false }]);
  }

  // const HandleNewMessage = (e: any) => {
  //   e.preventDefault();
  //   setMessages([...messages, {id:1, user: "Me", text: newMessage, isSent: true }]);
  //   socket.emit("chatmsg", { text: newMessage }) //envoie le message
    
  // const updatedMessages = [...messages, { id: messages.length + 1, user: "Me", text: newMessage, isSent: true }];
  // setMessages(updatedMessages);
  // setNewMessage("");
  //   setNewMessage('')
  //   testiii()
  //   setMessages([...messages, {id:2, user: "l autre", text: "baleck  frere", isSent: false }]);
  //   console.log(messages)

  // }

  const HandleNewMessage = (e: any) => {
    e.preventDefault();
    
    const newMessageObj = { id: messages.length + 1, user: "Me", text: newMessage, isSent: true };
    
    setMessages(prevMessages => [...prevMessages, newMessageObj, { id: newMessageObj.id + 1, user: "l autre", text: "baleck  frere", isSent: false }]);
    setNewMessage("");
    scrollToBottom()
  };

  const renderMessages = () => {
    return messages.map((message) => {
      const messageClass = message.isSent ? "sent-message" : "received-message";

      return (
        <div key={message.id} className={`message ${messageClass}`}>
          <span>{message.text}</span>
        </div>
      );
    });
  };

  const messageContainer : any = document.getElementById('tamere');

  function scrollToBottom() {
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }



  return (
    <div>
      <TopBar />
      <div className="chat-app" style={{ height: "100vh" }}>
        <div className="chat-app__sidebar">
          <div className="channel-list">
            <h2>Channels</h2>
            <ul className="containers">
              {Chanlist.map((chanName) => (
                <li className="active" key={chanName.id} >
                  {chanName.name} </li>
              ))}
            </ul>
            <form onSubmit={Channels} >
              <input type="text" placeholder="New chan" value={Channame} onChange={(e) => setChanname(e.target.value)} />

              {isChecked && <button className="add-channel-button" >Add Channel</button>}
            </form>
            <div>
              {!isChecked && (
                <form onSubmit={ChannelsMdp} >
                  <input type="password" placeholder="Mot de passe" value={ChanMdp} onChange={(e) => setChanMdp(e.target.value)} />
                  {!isChecked && <button className="add-channel-button" >Add Channel</button>}
                </form>
              )}
              <label>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
                channel public
              </label>
            </div><ToastContainer />
          </div>
        </div>

        <div className="chat-app__main">
          <div className="channel-header">
            <h2>General</h2>
            <button className="add-message-button">New Message</button>
          </div>



              {/* {/* <div className="message-sender">{messages.user}</div>
              <div className="message-text">{messages.text}</div> */}
             {/* <div className="message-input">
            <div className="message-item received">
              <div className="message-sender">My user</div>
              <div className="message-text">{newMessage}</div>
            </div> */}



          <div className="message-list">
          
           <div id="tamere" className="chat-list">
             {renderMessages()}
           </div>
            <div className="message-item sent">
                <form className="message-input" onSubmit={HandleNewMessage} >
                  <input type="text" placeholder="New message" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                  <button className="add-message-button" >Add Message</button>
                </form>
              </div>
            {/* </div> */}

          </div>
        </div>
      </div>
    </div>
  );
}
