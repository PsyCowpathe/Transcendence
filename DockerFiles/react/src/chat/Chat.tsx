import React, { useState, useEffect } from "react";
import "../css/chat.css";
import "../css/channel.css";
import { socketManager } from "../Pages/HomePage";
import { SetParamsToGetPost } from "../Headers/HeaderManager";
import { TopBar } from "../Pages/TopBar";
import { ToastContainer, toast } from 'react-toastify';
import UserInfoModal from '../Modale/UserModal'
import { GetChannelInfo } from "../Api/GetChanMessage";
import { GetChannelList } from "../Api/GetChannelList";
import { GetFriendList } from "../Api/GetFriendList";
import { GetPrivMsg } from "../Api/GetPrivateMsg";
import { useNavigate } from "react-router-dom";
import InviteModale from "../Modale/InviteModale";

let test: boolean = false
let socket: any


interface IUser {
  username: string;
  id: number;
}

interface User {
  name: string;
  uid: number
  ///////// interface a modifer pour avoir toute les info des user puis initialiser un User  avec toute ses info quand on recoit le token
}

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
  channel: string;
  user: string;
  userUID: number;
  text: string;
  isSent: boolean;
  isPriv: boolean;
}

export function Chat() {
  ////////////////////////////////////////////////////////////////////// chan manager //////////////////////////////////////////////////////////////////
  const UserName: any = localStorage.getItem('name')
  const UserUID: any = localStorage.getItem('UID')
  const [Channame, setChanname] = useState<string>('');
  const [ChanMdp, setChanMdp] = useState<string>('');
  const [Chanlist, setChanlist] = useState<Chati[]>([]);
  const navigate = useNavigate();

  socket = socketManager.getChatSocket()

  if (socket == null) {
    if (test === false && SetParamsToGetPost().headers.Authorization !== null) {
      socket = socketManager.initializeChatSocket(SetParamsToGetPost().headers.Authorization)
      console.log(socket)
      test = true
    }
  }
  const [UserList, setUserList] = useState<User[]>([]);
  function GetFriend() {
    setUserList([])
    GetFriendList()
      .then((response) => {
        console.log("FRIENDLIST:")
        console.log(response)

        setUserList(response.data.map((user: any, index: any) => {
          return { uid: user.id, name: user.name }
        }))
        console.log("UserLIST:")
        console.log(UserList)
      })
      .catch((err) => {
        if (err.response) {
            if (err.message !== "Request aborted") {
              if (err.response.data.message === "Invalid user" || err.response.data.message === "Invalid Bearer token")// erreur de token ==> redirection vers la page de change login
                navigate('/')
              if (err.response.data.message === "User not registered")// ==> redirection vers la page de register
                navigate('/Change')
              if (err.response.data.message === "Invalid 2FA token") //erreur de 2FA ==> redirection vers la page de 2FA
                navigate('/Send2FA')
          }
        }
        console.log(err)
      })
  }


  function GetChannel() {
    setChanlist([])
    GetChannelList()
      .then((response) => {
        console.log("chanlist")
        console.log(response)
        setChanlist(response.data.map((chan: any, index: any) => {
          return { id: index + Date.now(), name: chan }
        }
        ))

        console.log("Chan List")

        console.log(Chanlist)
      })
      .catch((err) => {
        if (err.response) {
            if (err.message !== "Request aborted") {
              if (err.response.data.message === "Invalid user" || err.response.data.message === "Invalid Bearer token")// erreur de token ==> redirection vers la page de change login
                navigate('/')
              if (err.response.data.message === "User not registered")// ==> redirection vers la page de register
                navigate('/Change')
              if (err.response.data.message === "Invalid 2FA token") //erreur de 2FA ==> redirection vers la page de 2FA
                navigate('/Send2FA')
            }
        }
        console.log(err)
      }
      )
  }


  useEffect(() => {
    /// get la friend list
    GetFriend()
  }, [])

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
      GetMsgChan()
    }
    const handleLeaveChannel = (response: any) => {
      console.log("response")
      toast.success(response, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        progressClassName: "my-progress-bar"
      })
      setSelectedChannel('')
      setMessages([])
      GetChannel()

    }
    const handleChatError = (response: any) => {
      console.log(response)
      toast.error(response, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        progressClassName: "my-progress-bar"
      })
      // GetChannel()
      // setSelectedChannel('')
      // GetMsgChan()
      // console.log("coucou jsuis sence rentrer")
    }
    const handleMuteUser = (response: any) => {
      console.log(response)
      toast.success(response, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        progressClassName: "my-progress-bar"
      })
    }
    const handleDeleteUser = (response: any) => {
      console.log(response)
      GetChannel()
      setMessages([])
      setSelectedChannel('')
      setChanToDelete('')
      toast.success(response, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        progressClassName: "my-progress-bar"
      })
    }

    socket.removeListener("leavechannel", handleLeaveChannel);
    socket.removeListener("muteuser", handleMuteUser);//
    socket.removeListener("deletechannel", handleDeleteUser);//
    socket.removeListener("createchannel", handleCreateChannel);
    socket.removeListener("ChatError", handleChatError);

    socket.on("deletechannel", handleDeleteUser);//
    socket.on("leavechannel", handleLeaveChannel);
    socket.on("muteuser", handleMuteUser);
    socket.on("createchannel", handleCreateChannel);
    socket.on("ChatError", handleChatError);

    return () => {
      socket.off("deletechannel", handleDeleteUser);//
      socket.off("muteuser", handleMuteUser);
      socket.off("leavechannel", handleLeaveChannel);
      socket.off("createchannel", handleCreateChannel);
      socket.off("ChatError", handleChatError);
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
      const newMessageObj = { id: Date.now(), channel: response.channel, user: response.user, userUID: response.id, text: response.message, isSent: false, isPriv: false };

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
      console.log("recieved")
      console.log(response)
      const newMessageObj = { id: Date.now(), channel: '', user: response.first_data.name, userUID: response.first_data.id, text: response.message, isSent: false, isPriv: true };
      setMessages(prevMessages => [...prevMessages, newMessageObj]);
      setMessages([])
      console.log(response.first_data.id)
      GetPrivMsg(response.first_data.id)
        .then((response) => {
          console.log(response)
          if (response.data !== null) {
            const newMessages = response.data.map((message: any, index: any) => {
              const isSent = message.username === UserName;
              return {
                id: index + Date.now(),
                channel: null,
                userUID: message.id,
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
          if (err.response) {
            if (err.response) {
              if (err.message !== "Request aborted") {
                if (err.message !== "Request aborted") {
                  if (err.response.data.message === "Invalid user" || err.response.data.message === "Invalid Bearer token")// erreur de token ==> redirection vers la page de change login
                    navigate('/')
                  if (err.response.data.message === "User not registered")// ==> redirection vers la page de register
                    navigate('/Change')
                  if (err.response.data.message === "Invalid 2FA token") //erreur de 2FA ==> redirection vers la page de 2FA
                    navigate('/Send2FA')
                }
              }
            }
          }
        });

    }
    socket.removeListener("usermessage");
    socket.on("usermessage", handlelistenMsg);

    return () => {
      socket.off("usermessage", handlelistenMsg);
    }
  }, [])




  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedChannel, setSelectedChannel] = useState('');

  const [User, setUser] = useState<User | null>(null);

  const handleUserClick = (useri: User | null) => {
    console.log("USERUIDDDDDD")
    if (useri !== null)
      console.log(useri)
    setSelectedUser(useri);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };


  const HandleNewMessage = (e: any) => {
    e.preventDefault();
    console.log("-----------------------------------selectedChannel---------------------------------")

    console.log(selectedChannel)
    console.log("-----------------------------------selectedChannel---------------------------------")

    if (selectedChannel) {
      console.log("-----------------------------------selectedChannel---------------------------------")

      socket.emit("channelmsg", { destination: selectedChannel, message: newMessage })
      const newMessageObj = { id: Date.now(), channel: selectedChannel, user: UserName, userUID: UserUID, text: newMessage, isSent: true, isPriv: false };
      setMessages(prevMessages => [...prevMessages, newMessageObj]);
    }
    else if (UserTo) {
      console.log("-----------------------------------selectedUser---------------------------------")
      console.log(UserTo)
      socket.emit("usermessage", { destination: UserTo, message: newMessage })
      const newMessageObj = { id: Date.now(), channel: '', user: UserName, userUID: UserUID, text: newMessage, isSent: true, isPriv: true };
      setMessages(prevMessages => [...prevMessages, newMessageObj]);
      console.log(messages)
    }
    setNewMessage("");
    // scrollToBottom()
  };

  const renderMessages = () => {
    console.log("ID-----------------------------------------------------------------------------------------------------------")


    return messages.map((message) => {
      console.log(message.id)
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
        <div key={message.id}>
          <div className={`message ${userClass}`} onClick={() => handleUserClick({ name: message.user, uid: message.userUID })}>
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



  const GetMsgChan = () => {
    console.log("selectedChannel")
    console.log(selectedChannel)
    if (selectedChannel) {
      GetChannelInfo(selectedChannel)    //recupere les message du channel
        .then((response) => {
          console.log(response)
          console.log("lol")
          if (response.data !== null) {
            const newMessages = response.data.map((message: any, index: any) => {
              const isSent = message.username === UserName;
              return {
                id: index,
                channel: selectedChannel,
                uid: message.id,
                user: message.username,
                text: message.message,
                isSent: isSent
              };
            });

            setMessages(newMessages);
          }
        })
        .catch((err) => {
          if (err.response) {
            if (err.message !== "Request aborted") {
              if (err.message !== "Request aborted") {
                if (err.response.data.message === "Invalid user" || err.response.data.message === "Invalid Bearer token")// erreur de token ==> redirection vers la page de change login
                  navigate('/')
                if (err.response.data.message === "User not registered")// ==> redirection vers la page de register
                  navigate('/Change')
                if (err.response.data.message === "Invalid 2FA token") //erreur de 2FA ==> redirection vers la page de 2FA
                  navigate('/Send2FA')
              }
            }
          }
          console.log(err)
        })
    }


  }


  const OpenChannel = (ChanUse: any) => {
    console.log("--------------------------------------")
    console.log(UserList)
    console.log("heuuuuuuuuu")
    console.log(ChanUse)
    setSelectedChannel(ChanUse)
    console.log(ChanUse)
    setMessages([])
    if (ChanUse !== null) {
      GetChannelInfo(ChanUse)    //recupere les message du channel
        .then((response) => {
          console.log(response)
          console.log("lol")
          if (response.data !== null) {

            const newMessages = response.data.map((message: any, index: number) => {
              const isSent = message.username === UserName;
              return {
                id: index,
                channel: ChanUse,
                user: message.username,
                userUID: message.id,
                text: message.message,
                isSent: isSent
              };
            });
            console.log(newMessages)
            setMessages(newMessages);
          }
        })
        .catch((err) => {
          if (err.response) {
            if (err.message !== "Request aborted") {
              if (err.message !== "Request aborted") {
                if (err.response.data.message === "Invalid user" || err.response.data.message === "Invalid Bearer token")// erreur de token ==> redirection vers la page de change login
                  navigate('/')
                if (err.response.data.message === "User not registered")// ==> redirection vers la page de register
                  navigate('/Change')
                if (err.response.data.message === "Invalid 2FA token") //erreur de 2FA ==> redirection vers la page de 2FA
                  navigate('/Send2FA')
              }
            }
          }
        })
    }
  }




  const [UserTo, setUserTo] = useState<any>('');
  const OpenUser = (UserUse: any) => {
    setUserTo("UserUse")
    setUserTo(UserUse)
    setSelectedChannel('')
    setMessages([])
    GetPrivMsg(UserUse)
      .then((response) => {
        console.log(response)
        if (response.data !== null) {
          const newMessages = response.data.map((message: any, index: any) => {
            const isSent = message.username === UserName;
            return {
              id: index + Date.now(),
              channel: null,
              userUID: message.id,
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
        if (err.response) {
          if (err.message !== "Request aborted") {
            if (err.message !== "Request aborted") {
              if (err.response.data.message === "Invalid user" || err.response.data.message === "Invalid Bearer token")// erreur de token ==> redirection vers la page de change login
                navigate('/')
              if (err.response.data.message === "User not registered")// ==> redirection vers la page de register
                navigate('/Change')
              if (err.response.data.message === "Invalid 2FA token") //erreur de 2FA ==> redirection vers la page de 2FA
                navigate('/Send2FA')
            }
          }
        }
      })
  }

  // -addadmin (nom de l’user a promote, nom du channel)
  const [AdminOn, setAdminOn] = useState<any>('');
  const [AdminName, setAdminName] = useState<any>('');
  const FormAdmin = () => {
    setAdminOn(!AdminOn)
  }

  const AddAdmin = (e: any) => {
    e.preventDefault();
    console.log(AdminName)
    console.log(selectedChannel)
    socket.emit("addadmin", { name: AdminName, channelname: selectedChannel })
    setAdminName('')
    setAdminOn(!AdminOn)

  }
  const [AdminToDel, setAdminToDel] = useState<any>('');
  const FormDelAdmin = () => {
    setAdminOn(!AdminOn)
    setSanctionManger(false)
  }

  const DelAdmin = (e: any) => {
    e.preventDefault();
    console.log(AdminToDel)
    console.log(selectedChannel)
    socket.emit("removedmin", { name: AdminToDel, channelname: selectedChannel })
    setAdminToDel('')
    setAdminOn(!AdminOn)

  }

  // -leavechannel (nom du channel a leave)
  // -deletechannel (nom du channel a delete)

  const [ChanToLeave, setChanToLeave] = useState<any>('');
  const LeaveChan = (chan: string) => {
    socket.emit("leavechannel", { channelname: chan })
    GetChannel()

    setChanToLeave('')

  }

  const [ChanToDelete, setChanToDelete] = useState<any>('');
  const DeleteChan = (chan: string) => {
    socket.emit("deletechannel", { channelname: chan })
    console.log("delete")
    console.log(Chanlist)
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  }
  const [menuOpen, setMenuOpen] = useState(false);
  const openMenu = () => {
    setMenuOpen(!menuOpen)
  }


  const [SanctionManger, setSanctionManger] = useState(false);
  const [UserToUnBan, setUserToUnBan] = useState<any>('');
  const Sanction = () => {
    setSanctionManger(!SanctionManger)
    setAdminOn(false)
  }

  const Unban = (e: any) => {
    e.preventDefault();
    socket.emit("unbanuser", { name: UserToUnBan, channelname: selectedChannel })
    setUserToUnBan('')
    // setSanctionManger(!SanctionManger)
  }

  const [UserToUnMute, setUserToUnMute] = useState<any>('');


  const UnMute = (e: any) => {
    e.preventDefault();
    socket.emit("unmuteuser", { name: UserToUnBan, channelname: selectedChannel })
    setUserToUnBan('')
    // setSanctionManger(!SanctionManger)
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
                {isChecked && <button className="add-message-button"  >Add Channel</button>}
              </form>}
              {!isChecked && (
                <form onSubmit={ChannelsMdp} >
                  <input type="text" placeholder="New chan" value={Channame} onChange={(e) => setChanname(e.target.value)} />
                  <input type="password" placeholder="Mot de passe" value={ChanMdp} onChange={(e) => setChanMdp(e.target.value)} />
                  <button type="submit" className="add-message-button"  >Add Channel</button>
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
                <input type="text" placeholder="channel name" value={ChanTo} onChange={(e) => setChanTo(e.target.value)} />
                <input type="password" placeholder="Mot de passe" value={ChanMdpTo} onChange={(e) => setChanMdpTo(e.target.value)} />
                <button type="submit" className="add-message-button" >Join Channel</button>
              </form>
            </div>
          </div>
        </div>
        <div className="chat-app__main">
          <div className="channel-header">
            <h2>{selectedChannel || 'General'}</h2>
            {selectedChannel && <button className="add-message-button" onClick={FormAdmin}>Manage admin</button>}
            {AdminOn && <form onSubmit={AddAdmin} >
              <input type="text" placeholder="New admin" value={AdminName} onChange={(e) => setAdminName(e.target.value)} />
              <button className="add-message-button"  type="submit" >Add admin</button>
            </form>
            }
            {AdminOn && <form onSubmit={DelAdmin} >
              <input type="text" placeholder="del admin" value={AdminToDel} onChange={(e) => setAdminToDel(e.target.value)} />
              <button className="add-message-button"  type="submit"  >Del admin</button>
            </form>
            }

            {selectedChannel && <button className="add-message-button" onClick={Sanction}>Manage Sanction</button>}
            {SanctionManger && <form onSubmit={Unban} >
              <input type="text" placeholder="Unban user" value={UserToUnBan} onChange={(e) => setUserToUnBan(e.target.value)} />
              <button className="add-message-button"  type="submit"  >Unban</button>
            </form>
            }
            {SanctionManger && <form onSubmit={UnMute} >
              <input type="text" placeholder="Unmute user" value={UserToUnMute} onChange={(e) => setUserToUnMute(e.target.value)} />
              <button className="add-message-button" type="submit"  >Unmute</button>
            </form>
            }



            {selectedChannel && <button className="add-message-button" onClick={() => DeleteChan(selectedChannel)}>delete</button>
            }
            {selectedChannel && <button className="add-message-button" onClick={() => LeaveChan(selectedChannel)}>Leave</button>}
            {selectedChannel && <button className="add-message-button" onClick={() => openMenu()}>invitation menu</button>}
            {menuOpen && <InviteModale onClose={openMenu} channel={selectedChannel} />}
          </div>

          <div className="message-list">

            <div className="chat-list">
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
              <li className="active" key={user.uid} onClick={() => OpenUser(user.uid)} >
                {user.name}
              </li>
            ))}
          </ul>
        </div>
        {/* </div> */}
      </div><ToastContainer />
    </div>
  );
}
