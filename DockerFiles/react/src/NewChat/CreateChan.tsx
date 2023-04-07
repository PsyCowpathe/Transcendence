import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./truc.css";
import { socketManager } from "../Pages/HomePage";
import { VraimentIlSaoule } from "../aurelcassecouilles/VraimentIlEstCasseCouille";
import { TopBar } from "../Pages/TopBar";
import { ToastContainer, toast } from 'react-toastify';
import UserInfoModal from '../Modale/UserModal'
import { GetChannelInfo } from "../Api/GetChanMessage";
import { GetUserInfo } from "../Api/GetUserInfo";
import { GetChannelList } from "../Api/GetChannelList";
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


  useEffect(() => {
    setChanlist([])
    GetChannelList()
      .then((response) => {
        setChanlist(response.data)
      })
      .catch((error) => {
        console.log(error)
      }
      )
  }, [])
  
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
    console.log("test sans  mdp")

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
    console.log("test avec mdp")
    e.preventDefault();
    
    if (Channame === '') {
      toast.error('Channel name is empty', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
        progressClassName: "my-progress-bar"
      });
      return
    }
    console.log("LE NOM DU CHANNEL")
    console.log(ChanMdp)

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
  
  const [newMessage, setNewMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  
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
  
 interface User {
  name: string;
   ///////// interface a modifer pour avoir toute les info des user puis initialiser un User  avec toute ses info quand on recoit le token
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
    console.log("je suis la")
    console.log(selectedChannel)
    socket.emit("channelmsg", { destination: selectedChannel, message: newMessage }) 
    const newMessageObj = { id: (messages.length + Date.now()), user: UserName, text: newMessage, isSent: true };
    
    setMessages(prevMessages => [...prevMessages, newMessageObj]);
    setNewMessage("");
    scrollToBottom()
  };

  const renderMessages = () => {

    //setMessages([...messages, {}]); //ajoute les message recup a la liste des message
    return messages.map((message) => {

      let messageClass
      if (message.user === UserName)
        messageClass = "sent-message"
      else
        messageClass =  "received-message";
      let userClass
      if (message.user === UserName)
      userClass = "sent-user"
    else
     userClass =  "received-user";
      
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
  const [ChanTo , setChanTo] = useState<any>(null);
  const [ChanMdpTo , setChanMdpTo] = useState<any>(null);
  const JoinChannel = () => { 

    socket.emit("joinchannel", { channelname: ChanTo, visibility: "private", password: undefined })
    //channel nane + password


}
const JoinChannelMdp = (e: any) => { 
  e.preventDefault();
  socket.emit("joinchannel", { channelname: ChanTo, visibility: "private", password: ChanMdpTo })
  //channel nane + password
  setChanMdpTo('')
}
  const [isChanchecked, setIsChanchecked] = useState(false);

  const handleChanChange = () => {
    setIsChanchecked(!isChanchecked);
  };



  /////////////////////////////////////TEST //////////////////////////////////////////


  const OpenChannel = (ChanUse : any) => {

    console.log(ChanUse)
    setSelectedChannel(ChanUse)
    console.log(ChanUse)
    setMessages([])
    if (ChanUse !== null) 
    {
    GetChannelInfo(ChanUse)    //recupere les message du channel
    .then((response) => {
      console.log(response)
      console.log("lol")
      // if (response.data !== undefined)
      // {
      const newMessages = response.data.map((message : any, index : any) => {
        const isSent = message.username === UserName;
        return {
          id: index,
          user: message.username,
          text: message.message,
          isSent: isSent
        };
      });
      setMessages(newMessages);
    // }
      // const newMessageObj = { id: (messages.length + Date.now()), user: UserName, text: newMessage, isSent: true };
      
      // setMessages(response.data.messages)
      // setMessages(prevMessages => [...prevMessages, newMessageObj]);
      // setNewMessage("");
    })
    .catch((error) => {
      console.log(error)
    })
  }
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
              <div key={message.id}> fdcd{message.text}</div>
            ))}
          </div>
        </div>
      );
    };
    

  return (
    <div>
      <TopBar />

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

            <form onSubmit={Channels} >
              <input type="text" placeholder="New chan" value={Channame} onChange={(e) => setChanname(e.target.value)} />

              {isChecked && <button type="submit" className="add-channel-button" >Add Channel</button>}
            </form>
            <div>
              {!isChecked && (
                <form onSubmit={ChannelsMdp} >
                  <input type="password" placeholder="Mot de passe" value={ChanMdp} onChange={(e) => setChanMdp(e.target.value)} />
                  <button type="submit" className="other" >Add Channel</button>
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

            {/* ////////////////?/////////////////////TEST ////////////////////////////////////////// */}
            <div>
                <form onSubmit={JoinChannelMdp} >
              <input type="text" placeholder="New chan" value={ChanTo} onChange={(e) => setChanTo(e.target.value)} />
                  <input type="password" placeholder="Mot de passe" value={ChanMdpTo} onChange={(e) => setChanMdpTo(e.target.value)} />
                   <button type="submit" className="other" >Join Channel</button>
                </form>
       
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
                  {selectedUser && (
                    <UserInfoModal user={selectedUser} Channel={selectedChannel} onClose= {handleCloseModal} />
                  )}
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
