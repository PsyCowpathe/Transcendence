import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./truc.css";
import { socketManager } from "../Pages/HomePage";
import { VraimentIlSaoule } from "../aurelcassecouilles/VraimentIlEstCasseCouille";
import { TopBar } from "../Pages/TopBar";
import { ToastContainer, toast } from 'react-toastify';
import UserInfoModal from '../Modale/UserModal'
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
  const UserName : any= localStorage.getItem('name')
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
      console.log("djj sjjdj")
      toast.success(response, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        progressClassName: "my-progress-bar"
      })
      console.log("ejbey")
      const newMessageObj = { id: (messages.length + Date.now()), user: response.user, text: response.texte, isSent: false };
    
      setMessages(prevMessages => [...prevMessages, newMessageObj]);
    }

    socket.on("channelmsg", handlelistenMsg);

    return () => {
      socket.off("channelmsg", handlelistenMsg);
    }
  }, [])
  
  
  
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
  
 interface User {
   name: string;
   ///////// interface a modifer pour avoir toute les info des user puis initialiser un User  avec toute ses info quand on recoit le token
 }
 
 interface Props {
   user: User;
 }
 
 const [selectedUser, setSelectedUser] = useState<User | null>(null);
 const [selectedChannel, setSelectedChannel] = useState(null);
 const [User , setUser] = useState<User | null>(null);
   
     const handleUserClick = (user: User | null) => {
       setSelectedUser(user);
       console.log("je suis la")
       console.log(user)
     };
   
     const handleCloseModal = () => {
       setSelectedUser(null);
     };


  const HandleNewMessage = (e: any) => {
    e.preventDefault();
    socket.emit("channelmsg", { message: newMessage, destination: "meillu" }) 
    const newMessageObj = { id: (messages.length + Date.now()), user: UserName, text: newMessage, isSent: true };
    
    setMessages(prevMessages => [...prevMessages, newMessageObj]);
    setNewMessage("");
    scrollToBottom()
  };

  const renderMessages = () => {

    //axios.get( ) //recupere les message du channel
    //setMessages([...messages, {}]); //ajoute les message recup a la liste des message


    return messages.map((message) => {
      const messageClass = message.isSent ? "sent-message" : "received-message";
      const userClass = message.isSent ? "sent-user" : "received-user";
     
      return (
          <div>

      <div className={`message ${userClass}`} onClick={() => handleUserClick({name: message.user})}>
          {message.user}
        </div>
        <div className="message-container">
                  <div key={message.id} className={`message ${messageClass}`}>
          <span>{message.text}</span>
        </div>
          </div>
          </div>
      );
    });
  };

  const messageContainer : any = document.getElementById('tamere');

  function scrollToBottom() {
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }

  /////////////////////////////////////TEST //////////////////////////////////////////
  

  

  useEffect(() => {
    const handlellistenban = (response: any) => {
      console.log("djj sjjdj")
      toast.success(response, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        progressClassName: "my-progress-bar"
      })
      socket.on("banuser", handlellistenban);

      return () => {
        socket.off("banuser", handlellistenban);
      }
    }
  }, [])

      
  const [UserToBan, setUserToBan] = useState('')
  const [reason , setReason] = useState('')
  const [timer , setTimer] = useState<number>(0)
  const BanUser = (e: any) => {
    e.preventDefault();
    socket.emit("banuser", { name: UserToBan, channelname: "coucou", time: timer, reason: reason })
  
  }

  /////////////////////////////////////TEST //////////////////////////////////////////


  const OpenChannel = (ChanUse : any) => {
    console.log(ChanUse)
    setSelectedChannel(ChanUse)



    }


    interface IMessage {
      id: number;
      text: string;
    }
    
    interface IChannel {
      id: number;
      name: string;
      messages: IMessage[];
    }
    
    interface IProps {
      channels: IChannel[];
    }
    
    const MessageDisplay: React.FC<IProps> = ({ channels }) => {
      const [selectedChannelId, setSelectedChannelId] = useState<number>(
        channels[0].id
      );
      const [selectedChannelMessages, setSelectedChannelMessages] = useState<
        IMessage[]
      >(channels[0].messages);
    
      const handleChannelClick = (channelId: number) => {
        setSelectedChannelId(channelId);
        setSelectedChannelMessages(
          channels.find((channel) => channel.id === channelId)?.messages || []
        );
      };
    
      return (
        <div>
          <div>
            {channels.map((channel) => (
              <button key={channel.id} onClick={() => handleChannelClick(channel.id)}>
                {channel.name}
              </button>
            ))}
          </div>
          <div>
            {selectedChannelMessages.map((message) => (
              <div key={message.id}>{message.text}</div>
            ))}
          </div>
        </div>
      );
    };
    
    const getMessagesForChannel = (channelName : any) => {
      return messages.filter((msg : any) => msg.channel === channelName);
    };

    const MessageList = ({ messages }: { messages: any }) => {
            return (
        <div className="message-list">
          {messages.map((msg : any) => (
            <div className="message-item" key={msg.id}>
              <div className="message-text">{msg.text}</div>
              <div className="message-time">{msg.time}</div>
            </div>
          ))}
        </div>
      );
    };





  return (
    <div>
      <TopBar />
              {/* <div>
              <form onSubmit={BanUser} >
              <input type="text" placeholder="who i ban ?" value={UserToBan} onChange={(i) => setUserToBan(i.target.value)} />
              <input type="text" placeholder="why?" value={reason} onChange={(i) => setReason(i.target.value)} />
              <input type="number" placeholder="12" value={timer} onChange={(i) => setTimer(parseInt(i.target.value))} />
              <button className="add-message-button" >Ban</button>
            </form>
              </div> */}
      <div className="chat-app" style={{ height: "100vh" }}>
        <div className="chat-app__sidebar">
          <div className="channel-list">
            <h2>Channels</h2>
            <ul className="containers" >
            {/* // onClick={Gotochan} > */}
              {Chanlist.map((chanName) => (
                <li className="active" key={chanName.id} onClick={() => OpenChannel(chanName.name)} >
                  {chanName.name}
                </li>
              ))}
            </ul>

            {selectedUser && (
              <UserInfoModal user={selectedUser} onClose= {handleCloseModal} />
            )}
            <form onSubmit={Channels} >
              <input type="text" placeholder="New chan" value={Channame} onChange={(e) => setChanname(e.target.value)} />

              {isChecked && <button className="add-channel-button" >Add Channel</button>}
            </form>
            <div>
              {!isChecked && (
                <form onSubmit={ChannelsMdp} >
                  <input type="password" placeholder="Mot de passe" value={ChanMdp} onChange={(e) => setChanMdp(e.target.value)} />
                  {!isChecked && <button className="other" >Add Channel</button>}
                </form>
              )}
      
              <label>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
                private channel
              </label>
            </div>
          </div>
        </div>


        <div className="chat-app__main">
          <div className="channel-header">
            <h2>{selectedChannel || 'General'}</h2>
            <button className="add-message-button">New Message</button>
          </div>
   
          <div className="message-list">
         
            <div id="tamere" className="chat-list">
              {renderMessages()}
            </div>


            <div className="message-item sent">
                <form className="message-input" onSubmit={HandleNewMessage} >
                  <input
                   type="text"
                  placeholder="New message"
                   value={newMessage}
                   onChange={(e) => setNewMessage(e.target.value)} />
                  <button className="add-message-button" >Add Message</button>
                </form>
              </div>

          </div> 
        </div> 
      </div><ToastContainer />
    </div>
  );
}
