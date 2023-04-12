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
import { GetFriendList } from "../Api/GetFriendList";
import { GetPrivMsg } from "../Api/GetPrivateMsg";
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
  id: number;
  channel : string;
  user: string;
  text: string;
  isSent: boolean;
  isPriv : boolean;
}

export function Chat() {
  ////////////////////////////////////////////////////////////////////// chan manager //////////////////////////////////////////////////////////////////
  const UserName: any = localStorage.getItem('name')
  // const [UseChan, setUseChan] = useState<string>('');
  const [responses, setResponse] = useState<string>("vide");
  const [Channame, setChanname] = useState<string>('');
  const [ChanMdp, setChanMdp] = useState<string>('');
  const [Chanlist, setChanlist] = useState<Chati[]>([]);
  
  
  socket = socketManager.getChatSocket()
  
  if (socket == null) {
    if (test === false && VraimentIlSaoule().headers.Authorization !== null) {
      socket = socketManager.initializeChatSocket(VraimentIlSaoule().headers.Authorization)
      console.log(socket)
      test = true
    }
  }
  
  function GetChannel() 
  {
    setChanlist([])
    GetChannelList()
      .then((response) => {
        console.log("chanlist")
        console.log(response)
        setChanlist(response.data.map((chan:any, index : any) => {
          return { id: index+ Date.now(), name: chan}
        }
        ))
        
        console.log("Chan List")
  
        console.log(Chanlist)
      })
      .catch((err) => {
        
      if(err.response.data.message == "Invalid user" || err.message.data.message === "Invalid Bearer token")// erreur de token ==> redirection vers la page de change login
      {
        console.log("coucou ?")
        window.location.assign('/')
      }
      if ( err.message === "User not registered")// ==> redirection vers la page de register
      {
        console.log("ERROR")
        console.log(err)
        window.location.assign('/Change')
     }
        console.log(err)
  
      }
      )
    }

  useEffect(() => {
  GetChannel()

  }, [])



  useEffect(() => {
    const handleCreateChannel = (response: any) => {
      console.log("response")
      toast.success(response, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        progressClassName: "my-progress-bar"
      })
      GetChannel()
      GetChannelInfo(selectedChannel)

      // setResponse("dont change");
    }
    const handleCreateChannels = (response: any) => {
      console.log(response)
      toast.error(response, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        progressClassName: "my-progress-bar"
      })
      GetChannel()
      setSelectedChannel('')
      GetChannelInfo(selectedChannel)
      // console.log("coucou jsuis sence rentrer")
      // setResponse("change");

    }
      socket.removeListener("createchannel", handleCreateChannel);
      socket.removeListener("ChatError", handleCreateChannels);
    socket.on("createchannel", handleCreateChannel);
    socket.on("ChatError", handleCreateChannels);

    return () => {
      socket.off("createchannel", handleCreateChannel);
      socket.off("ChatError", handleCreateChannels);
    }
  }, [])

  useEffect(() => {
    const handleCreateChannel = (response: any) => {
      console.log("response")
      console.log(response)

      toast.success(response.message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        progressClassName: "my-progress-bar"
      })
      console.log(response.channel)
      setSelectedChannel(response.channel);
      // setUseChan(response.channel);
      // setResponse("dont change");
    GetChannel()

    }


    socket.on("joinchannel", handleCreateChannel);

    return () => {
      socket.off("joinchannel", handleCreateChannel);
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
      setSelectedChannel(Channame)
    
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
    if (ChanMdp === '') 
      socket.emit("createchannel", { channelname: Channame, visibility: "public", password: undefined })
    else
      socket.emit("createchannel", { channelname: Channame, visibility: "public", password: ChanMdp })
      setSelectedChannel(Channame)
    setChanMdp('')
    setChanname('')
      
    }
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    if (responses !== "change") {
      setChanlist([...Chanlist, { id: Date.now(), name: Channame }]);
    }
    setChanname('')
    setChanMdp('')
    setResponse("vide")
  }, [responses])


  const [ChanTo, setChanTo] = useState<any>('');
  const [ChanMdpTo, setChanMdpTo] = useState<any>('');

  const JoinChannelMdp = (e: any) => {
    e.preventDefault();
    socket.emit("joinchannel", { channelname: ChanTo, visibility: "private", password: ChanMdpTo })
    //channel nane + password
    setChanMdpTo('')
    setChanTo('')
  }
  /////////////////////////////////////////////////////////////////////////message manager///////////////////////////////////////////

  const [newMessage, setNewMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const handlelistenMsg = (response: any) => {
      console.log("recieved")
      toast.success("New message on " + response.channel, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        progressClassName: "my-progress-bar"
      })
      const newMessageObj = { id: Date.now(), channel:response.channel, user: response.user, text: response.message, isSent: false, isPriv: false };

      setMessages(prevMessages => [...prevMessages, newMessageObj]);
    }
    socket.removeListener("channelmsg");
    socket.on("channelmsg", handlelistenMsg);

    return () => {
      socket.off("channelmsg", handlelistenMsg);
    }
  }, [])


  useEffect(() => {
    const handlelistenMsg = (response: any) => {
      const newMessageObj = { id:  Date.now(), channel:'', user: response.first_data, text: response.message, isSent: false, isPriv: true };
      setMessages(prevMessages => [...prevMessages, newMessageObj]);
    }
    socket.removeListener("usermessage");
    socket.on("usermessage", handlelistenMsg);

    return () => {
      socket.off("usermessage", handlelistenMsg);
    }
  }, [])

  interface User {
    name: string;
    ///////// interface a modifer pour avoir toute les info des user puis initialiser un User  avec toute ses info quand on recoit le token
  }


  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedChannel, setSelectedChannel] = useState('');

  const [User, setUser] = useState<User | null>(null);

  const handleUserClick = (user: User | null) => {
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };


  const HandleNewMessage = (e: any) => {
    e.preventDefault();
    console.log(selectedChannel)
    if (selectedChannel !== '') {

    socket.emit("channelmsg", { destination: selectedChannel, message: newMessage })
    const newMessageObj = { id: Date.now(), channel:selectedChannel, user: UserName, text: newMessage, isSent: true, isPriv: false };
    setMessages(prevMessages => [...prevMessages, newMessageObj]);
    }
    else if (UserTo !== '')
    {

      socket.emit("usermessage", { destination: UserTo, message: newMessage })
      const newMessageObj = { id: Date.now(), channel:'', user: UserName, text: newMessage, isSent: true, isPriv: true };
      setMessages(prevMessages => [...prevMessages, newMessageObj]);
      console.log(messages)
    }
    setNewMessage("");
    scrollToBottom()
  };

  const renderMessages = () => {

    return messages.map((message) => {

      let messageClass
      if (message.user === UserName)
        messageClass = "sent-message"
      else
        messageClass = "received-message";
      let userClass
      if (message.user === UserName)
        userClass = "sent-user"
      else
        userClass = "received-user";
      if (message.isPriv == false && message.channel !== selectedChannel)
        return
      else if (message.isPriv == true && (message.user !== UserTo && message.user !== UserName))
        return
      return (
        <div>
          <div className={`message ${userClass}`} onClick={() => handleUserClick({ name: message.user })}>
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

  const messageContainer: any = document.getElementById('tamere');

  function scrollToBottom() {
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }

  /////////////////////////////////////TEST //////////////////////////////////////////
  /////////////////////////////////////TEST //////////////////////////////////////////






  const OpenChannel = (ChanUse: any) => {

    console.log(ChanUse)
    setSelectedChannel(ChanUse)
    console.log(ChanUse)
    setMessages([])
    if (ChanUse !== null) {
      GetChannelInfo(ChanUse)    //recupere les message du channel
        .then((response) => {
          console.log(response)
          console.log("lol")
           if (response.data !== null)
           {
          const newMessages = response.data.map((message: any, index: any) => {
            const isSent = message.username === UserName;
            return {
              id:  Date.now(),
              channel: ChanUse,
              user: message.username,
              text: message.message,
              isSent: isSent
            };
          });
          setMessages(newMessages);
        }
        })
        .catch((err) => {
          if(err.response.data.message == "Invalid user" || err.message.data.message === "Invalid Bearer token")// erreur de token ==> redirection vers la page de change login
          {
            console.log("coucou ?")
            window.location.assign('/')
          }
          if ( err.message === "User not registered")// ==> redirection vers la page de register
          {
            console.log("ERROR")
            console.log(err)
            window.location.assign('/Change')
         }
          console.log(err)
        })
    }
  }
  
    interface IUser {
      id: number;
      username: string;
    }
    const [UserList, setUserList] = useState<IUser[]>([]);

  useEffect(() => { /// get la friend list
    GetFriendList()
      .then((response) => {
        console.log("FRIENDLIST:")
        console.log(response)
        setUserList(response.data.map((user:any, index : any) => {
          return { id:  Date.now(), username: user}
        }
        ))
        console.log("UserLIST:")
        console.log(UserList)
      })
      .catch((err) => {
        console.log(err)
      }
      )
  }, [])
  

  const [UserTo, setUserTo] = useState<any>('');
  const OpenUser = (UserUse: any) => {
    setUserTo(UserUse)
    setSelectedChannel('')
    GetPrivMsg(UserUse)
    .then((response) => {
      console.log(response)
      if (response.data !== null)
       {const newMessages = response.data.map((message: any, index: any) => {
            const isSent = message.username === UserName;
            return {
              id: messages.length + Date.now(),
              channel: null,
              user: message.username,
              text: message.message,
              isSent: isSent
            };
          });
          setMessages(newMessages);
        }
        })
        .catch((err) => {
          console.log(err)
          if(err == "Invalid user" || err.message.data.message === "Invalid Bearer token")// erreur de token ==> redirection vers la page de change login
          {
            console.log("coucou ?")
            window.location.assign('/')
          }
          if ( err.message === "User not registered")// ==> redirection vers la page de register
          {
            console.log("ERROR")
            console.log(err)
            window.location.assign('/Change')
         }/////////////////addd 2faa
          console.log(err)
        }
        )
    
    
  }

  // -addadmin (nom de l’user a promote, nom du channel)
  const [AdminOn, setAdminOn] = useState<any>('');
  const [AdminName, setAdminName] = useState<any>('');
  const FormAdmin = () => {
    setAdminOn(!AdminOn)
  }

  const AddAdmin = (e : any) => {
    e.preventDefault();
    console.log(AdminName)
    console.log(selectedChannel)
    socket.emit("addadmin", { name: AdminName, channelname: selectedChannel })
    setAdminName('')
    setAdminOn(!AdminOn)
    
  }

// -leavechannel (nom du channel a leave)
// -deletechannel (nom du channel a delete)

  const [ChanToLeave, setChanToLeave] = useState<any>('');
  const LeaveChan = (chan : string) => {
    socket.emit("leavechannel", { channelname: chan })
    GetChannel()
    setChanToLeave('')
  
  }

  const [ChanToDelete, setChanToDelete] = useState<any>('');
  const DeleteChan = (chan : string) => {
    socket.emit("deletechannel", { channelname: chan })
    console.log("delete")
    GetChannel()
    console.log(Chanlist)
    setChanToDelete('')
  }


  return (
    <div>
      <TopBar />

      <div className="chat-app">
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
            <div >
            {isChecked && <form onSubmit={Channels} >
              <input type="text" placeholder="New chan" value={Channame} onChange={(e) => setChanname(e.target.value)} />
              {isChecked && <button  className="add-channel-button" >Add Channel</button>}
            </form>}
              {!isChecked && (
                <form onSubmit={ChannelsMdp} >
                  <input type="text" placeholder="New chan" value={Channame} onChange={(e) => setChanname(e.target.value)} />
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
            {selectedChannel && <button className="add-message-button" onClick={FormAdmin}>Add admin</button>}
            {AdminOn && <form onSubmit={AddAdmin} >
              <input type="text" placeholder="New admin" value={AdminName} onChange={(e) => setAdminName(e.target.value)} />
              <button type="submit" className="other" >Add admin</button>
            </form>
            } 
            {selectedChannel && <button className="add-message-button" onClick={() => DeleteChan(selectedChannel)}>delete</button> 
            }
            {selectedChannel &&<button className="add-message-button" onClick={() => LeaveChan(selectedChannel)}>Leave</button> }
          </div>

          <div className="message-list">

            <div id="tamere" className="chat-list">
              {renderMessages()}
            </div>
            {selectedUser && (
              <UserInfoModal user={selectedUser} Channel={selectedChannel} onClose={handleCloseModal} />
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
        {/* <div className="friend-app__main"> */}
          <div className="friend-app__sidebar">
            <h1>Friend List</h1>
              <ul className="containers">

                {UserList.map((user) => (
                  <li className="active" key={user.id} onClick={() => OpenUser(user.username)} >
                    {user.username}
                  </li>
                ))}
              </ul>
              </div>
        {/* </div> */}
      </div><ToastContainer />
    </div>
  );
}
