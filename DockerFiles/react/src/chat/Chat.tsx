import React, { useState, useEffect } from "react";
import 'react-toastify/dist/ReactToastify.css';
import "../css/chat.css";
import "../css/channel.css";
import "../css/sidebar_info.css";
import "../css/messages.css";
import "../css/UserPage.css";
import "../css/Force.css";
import { socketManager } from "../Pages/HomePage";
import { SetParamsToGetPost } from "../Headers/HeaderManager";
import { TopBar } from "../Pages/NavBar";
import { ToastContainer, toast } from 'react-toastify';
import UserInfoModal from '../Modale/UserModal'
import { GetChannelInfo } from "../Api/GetChanMessage";
import { GetChannelList } from "../Api/GetChannelList";
import { GetFriendList } from "../Api/GetFriendList";
import { GetPrivMsg } from "../Api/GetPrivateMsg";
import { useNavigate } from "react-router-dom";
import InviteModale from "../Modale/InviteModale";
import { GetChannelInvite } from "../Api/GetChannelInvite";

let test: boolean = false
let socket: any
let socketFriend: any
let socketStatus : any

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

interface chan {
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

 
  const [GeneralName, setGeneralName] = useState<string>('');
  ////////////////////////////////////////////////////////////////////// chan manager //////////////////////////////////////////////////////////////////
  const UserName: any = localStorage.getItem('name')
  const UserUID: any = localStorage.getItem('UID')
  const [Channame, setChanname] = useState<string>('');
  const [ChanMdp, setChanMdp] = useState<string>('');
  const [Chanlist, setChanlist] = useState<Chati[]>([]);
  const navigate = useNavigate();

  socket = socketManager.getChatSocket()
  socketFriend = socketManager.getFriendRequestSocket()
  socketStatus = socketManager.getFriendRequestSocket()

  if (!socketFriend) {
    const token = SetParamsToGetPost().headers.Authorization;
    if (token !== null) {
      socketManager.initializeFriendRequestSocket(token);
      socketFriend = socketManager.getFriendRequestSocket();
    }
  }
    if (!socketStatus) {
    const token = SetParamsToGetPost().headers.Authorization;
    if (token !== null) {
      socketManager.initializeStatusSocket(token);
      socketStatus = socketManager.getStatusSocket();
    }
  }


  if (socket == null) {
    if (test === false && SetParamsToGetPost().headers.Authorization !== null) {
      socket = socketManager.initializeChatSocket(SetParamsToGetPost().headers.Authorization)
      test = true
    }
  }
  const [UserList, setUserList] = useState<User[]>([]);
  function GetFriend() {
    setUserList([])
    GetFriendList()
      .then((response) => {
        setUserList(response.data.map((user: any, index: any) => {
          return { uid: user.id, name: user.name }
        }))
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
  const [ChanInvite, setChanInvite] = useState<chan[]>([]);
  function GetInvite() {
    setChanInvite([])
    GetChannelInvite()
      .then((response) => {
        setChanInvite(response.data.map((chan: any, index: any) => {
          return { id: index + Date.now(), name: chan }
        }))
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
        setChanlist(response.data.map((chan: any, index: any) => {
          return { id: index + Date.now(), name: chan }
        }
        ))
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
    GetInvite()
  }, [])
  useEffect(() => {
    /// get la friend list
    GetFriend()
  }, [])

  useEffect(() => {
    /// get la channel list
    GetChannel()

  }, [])



  useEffect(() => {
    const handleCreateChannel = (response: any) => {
      toast.success(response, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        progressClassName: "my-progress-bar"
      })

      GetChannel()
      GetMsgChan()
      GetInvite()

    }
    const handleLeaveChannel = (response: any) => {
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
      if (typeof response === 'string') {
        toast.error(response, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
          progressClassName: "my-progress-bar"
        })
        if (response === "This channel name is already used !" || response === "The channel specified dont exist !") {

          GetChannel()
          setSelectedChannel('')
          setGeneralName('')
          GetMsgChan()
        }
      }
      if (typeof response == 'object') {
        toast.error(response[0], {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
          progressClassName: "my-progress-bar"
        })
        if (response[0] === "The channel name must contain between 3 and 20 caracters !") {
          GetChannel()
          setSelectedChannel('')
          setGeneralName('')
          GetMsgChan()
        }
      }

      // GetChannel()
      // setSelectedChannel('')
      // GetMsgChan()
    }
    const handleMuteUser = (response: any) => {
      toast.success(response, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        progressClassName: "my-progress-bar"
      })
    }
    const handleDeleteUser = (response: any) => {
      GetChannel()
      GetInvite()

      setMessages([])
      setSelectedChannel('')
      setChanToDelete('')
      toast.success(response, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        progressClassName: "my-progress-bar"
      })
    }
    const handleInvite = (response: any) => {
      GetInvite()
    }

    const handleKickuser = (response: any) => {
      if (response.message !== `You successfully kicked user ${response.user} !`) {
        GetChannel()
        setMessages([])
        setSelectedChannel('')
        setGeneralName('')
        setChanToDelete('')
      }
      toast.success(response.message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        progressClassName: "my-progress-bar"
      })
    }
        const handleErrorRequest = (response: any) => {
   
      toast.error(response, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        progressClassName: "my-progress-bar"
      })
    }

    const handleFriend = (response: any) => {
      GetFriend()
    }

    socket.removeListener("leavechannel", handleLeaveChannel);
    socket.removeListener("muteuser", handleMuteUser);//
    socket.removeListener("deletechannel", handleDeleteUser);//
    socket.removeListener("createchannel", handleCreateChannel);
    socket.removeListener("ChatError", handleChatError);
    socket.removeListener("createinvitation", handleInvite);
    socket.removeListener("kickuser", handleKickuser);
    socketStatus.removeListener('status');
    socketFriend.removeListener("acceptfriendrequest", handleFriend);

    socket.on("deletechannel", handleDeleteUser);//
    socketFriend.on("acceptfriendrequest", handleFriend);//
    socket.on("createinvitation", handleInvite);//
    socket.on("leavechannel", handleLeaveChannel);
    socket.on("muteuser", handleMuteUser);
    socket.on("createchannel", handleCreateChannel);
    socket.on("ChatError", handleChatError);
    socketStatus.on("status", handleErrorRequest);
    socket.on("kickuser", handleKickuser);

    return () => {
      // socketFriend.off("acceptfriendrequest", handleFriend);//

      socket.off("kickuser", handleKickuser);
      socket.off("createinvitation", handleInvite);//
      socket.off("deletechannel", handleDeleteUser);//
      socket.off("muteuser", handleMuteUser);
      socket.off("leavechannel", handleLeaveChannel);
      socket.off("createchannel", handleCreateChannel);
      socketStatus.off("status", handleErrorRequest);
      socket.off("ChatError", handleChatError);
    }
  }, [])

  useEffect(() => {
    const handleCreateChannel = (response: any) => {

      toast.success(response.message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        progressClassName: "my-progress-bar"
      })
      setSelectedChannel(response.channel);
      setChanlist([])
      GetChannel()
      GetChannelInfo(response.channel)    //recupere les message du channel
        .then((response) => {
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
      GetInvite()
    }
    socket.on("joinchannel", handleCreateChannel);
    return () => {
      socket.off("joinchannel", handleCreateChannel);
    }
  }, [])

  const Channels = (e: any) => {
    e.preventDefault();
    if (Channame === '') {
      toast.error('Channel name is empty', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        progressClassName: "my-progress-bar"
      });
      return
    }
    socket.emit("createchannel", { channelname: Channame, visibility: "private", password: undefined })
    setSelectedChannel(Channame)
    setGeneralName(Channame)
    setMessages([])
    setChanMdp('')
    setChanname('')

  }
  const ChannelsMdp = async (e: any) => {
    e.preventDefault();

    if (Channame === '') {
      toast.error('Channel name is empty', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        progressClassName: "my-progress-bar"
      });
      return
    }
    if (ChanMdp === '')
      socket.emit("createchannel", { channelname: Channame, visibility: "public", password: undefined })
    else
      socket.emit("createchannel", { channelname: Channame, visibility: "public", password: ChanMdp })

    setSelectedChannel(Channame)
    setGeneralName(Channame)
    setMessages([])
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
    setSelectedChannel(ChanTo)
    setGeneralName(ChanTo)
    setMessages([])

    setChanMdpTo('')
    setChanTo('')
  }
  /////////////////////////////////////////////////////////////////////////message manager///////////////////////////////////////////

  const [newMessage, setNewMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const handlelistenMsg = (response: any) => {
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
      const newMessageObj = { id: Date.now(), channel: '', user: response.first_data.name, userUID: response.first_data.id, text: response.message, isSent: false, isPriv: true };
      setMessages(prevMessages => [...prevMessages, newMessageObj]);
      setMessages([])
      GetPrivMsg(response.first_data.id)
        .then((response) => {
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
              if (err.response.data.message === "Invalid user" || err.response.data.message === "Invalid Bearer token")// erreur de token ==> redirection vers la page de change login
                navigate('/')
              if (err.response.data.message === "User not registered")// ==> redirection vers la page de register
                navigate('/Change')
              if (err.response.data.message === "Invalid 2FA token") //erreur de 2FA ==> redirection vers la page de 2FA
                navigate('/Send2FA')
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

    if (useri !== null)
      setSelectedUser(useri);

    // setGeneralName(useri.name)
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };


  const HandleNewMessage = (e: any) => {
    e.preventDefault();
    if (newMessage !== '' && newMessage.length < 135) {
      if (selectedChannel) {
        socket.emit("channelmsg", { destination: selectedChannel, message: newMessage })
        const newMessageObj = { id: Date.now(), channel: selectedChannel, user: UserName, userUID: UserUID, text: newMessage, isSent: true, isPriv: false };
        setMessages(prevMessages => [...prevMessages, newMessageObj]);
      }
      else if (UserTo) {
        socket.emit("usermessage", { destination: UserTo, message: newMessage })
        const newMessageObj = { id: Date.now(), channel: '', user: UserName, userUID: UserUID, text: newMessage, isSent: true, isPriv: true };
        setMessages(prevMessages => [...prevMessages, newMessageObj]);
      }
    }
    setNewMessage("");
    // scrollToBottom()
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
        const MESSAGE_LINE_LENGTH = 25;
        const messageText = message.text.match(new RegExp(`.{1,${MESSAGE_LINE_LENGTH}}`, "g"));
        if (messageText === null)
          return
      return (
        <div key={message.id}>
          <div className={`message ${userClass}`} onClick={() => handleUserClick({ name: message.user, uid: message.userUID })}>
            {message.user}
          </div>
          <div className="message-container">
            <div key={message.id} className={`message ${messageClass}`}>
              <span className="break-word">{messageText}</span>
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



  const GetMsgChan = () => {
    if (selectedChannel) {
      GetChannelInfo(selectedChannel)    //recupere les message du channel
        .then((response) => {
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


  }


  const OpenChannel = (ChanUse: any) => {
    setSelectedChannel(ChanUse)
    setGeneralName(ChanUse)
    setMessages([])
    if (ChanUse !== null) {
      GetChannelInfo(ChanUse)    //recupere les message du channel
        .then((response) => {
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
            setMessages(newMessages);
          }
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
        })
    }
  }




  const [UserTo, setUserTo] = useState<any>('');
  const OpenUser = (UserUse: any, username: string) => {
    setUserTo("UserUse")
    setUserTo(UserUse)
    setGeneralName(username)
    setSelectedChannel('')
    setMessages([])
    GetPrivMsg(UserUse)
      .then((response) => {
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
      })
  }

  const [AdminOn, setAdminOn] = useState<any>('');
  const [AdminName, setAdminName] = useState<any>('');
  const FormAdmin = () => {
    setSanctionManger(false)
    setOpenNewMdp(false)
    setAdminOn(!AdminOn)
  }

  const AddAdmin = (e: any) => {
    e.preventDefault();
    socket.emit("addadmin", { name: AdminName, channelname: selectedChannel })
    setAdminName('')
    setAdminOn(!AdminOn)

  }
  const [AdminToDel, setAdminToDel] = useState<any>('');

  const DelAdmin = (e: any) => {
    e.preventDefault();
    socket.emit("removeadmin", { name: AdminToDel, channelname: selectedChannel })
    setAdminToDel('')
    setAdminOn(!AdminOn)

  }

  const LeaveChan = (chan: string) => {
    socket.emit("leavechannel", { channelname: chan })
    GetChannel()
    setSelectedChannel('')
    setGeneralName('')
  }

  const [ChanToDelete, setChanToDelete] = useState<any>('');
  const DeleteChan = (chan: string) => {
    socket.emit("deletechannel", { channelname: chan })
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
    setOpenNewMdp(false)
  }

  const Unban = (e: any) => {
    e.preventDefault();
    socket.emit("unbanuser", { name: UserToUnBan, channelname: selectedChannel })
    setUserToUnBan('')
    setSanctionManger(!SanctionManger)
  }

  const [UserToUnMute, setUserToUnMute] = useState<any>('');


  const UnMute = (e: any) => {
    e.preventDefault();
    socket.emit("unmuteuser", { name: UserToUnMute, channelname: selectedChannel })
    setUserToUnMute('')

    setSanctionManger(!SanctionManger)
  }


  const [newMdp, setNewMdp] = useState<string>('');
  const [openNewMdp, setOpenNewMdp] = useState(false);

  const OpenNewMdp = () => {
    setOpenNewMdp(!openNewMdp)
    setAdminOn(false)
    setSanctionManger(false)
  }
  const ChangePassword = (e: any) => {
    e.preventDefault();
    if (newMdp === '')
      socket.emit("changepassword", { channelname: selectedChannel, password: undefined })
    else
      socket.emit("changepassword", { channelname: selectedChannel, password: newMdp })
    setOpenNewMdp(!openNewMdp)
    setNewMdp('')
  }

	//////////////////////////// <PONG INVITES/> //////////////////////////////
	
	useEffect(() =>
	{
		let socketPong: any;
		
		socketPong = socketManager.getPongSocket();
		if (!socketPong)
		{
			const token = SetParamsToGetPost().headers.Authorization;
			if (token !== null)
			{
				socketManager.initializePongSocket(token);
				socketPong = socketManager.getPongSocket();
			}
		}

		const handleGameError = (response: any) =>
		{
		    toast.error(response, {
   	     		position: toast.POSITION.TOP_RIGHT,
   	     		autoClose: 2000,
   	     		progressClassName: "my-progress-bar"
			});
		};

		const handleDuelInviteReceived = (opponent: string) =>
		{
			const message = opponent + " challenged you to a pong duel";
	
		    toast.success(message, {
    			position: toast.POSITION.TOP_RIGHT,
       			autoClose: 2000,
       	 		progressClassName: "my-progress-bar"
      		});
		};

		const handleDuelInviteCanceled = (opponent: string) =>
		{
			const message = opponent + " canceled his/her duel invitation";
	
		    toast.success(message, {
   		     	position: toast.POSITION.TOP_RIGHT,
   		     	autoClose: 2000,
   	    		progressClassName: "my-progress-bar"
    	 	});
		}

		const handleDuelInviteAnswered = (opponent: string, accepted: boolean, join: string = "") =>
		{
			let message: string = "";
			if (join == "join")
			{
				navigate('/pong/play');
				return ;
			}
			if (accepted)
			{
				message = opponent + " accepted your duel invitation";
			}
			else
			{
				message = opponent + " delined your duel invitation";
			}
		    toast.success(message, {
   			 	position: toast.POSITION.TOP_RIGHT,
       			autoClose: 2000,
        		progressClassName: "my-progress-bar"
			});
		};

		const handleJoinDuel = () =>
		{
			navigate('/pong/play');
		};

		socketPong.removeListener('duelInviteReceived');
		socketPong.removeListener('duelInviteCanceled');
		socketPong.removeListener('duelInviteAnswered');
		socketPong.removeListener('joinDuel');

		socketPong.on('duelInviteReceived', handleDuelInviteReceived);
		socketPong.on('duelInviteCanceled', handleDuelInviteCanceled);
		socketPong.on('duelInviteAnswered', handleDuelInviteAnswered);
		socketPong.on('joinDuel', handleJoinDuel);
		socketPong.on('GameError', handleGameError);

	    return () => {
			socketPong.off('duelInviteReceived', handleDuelInviteReceived);
			socketPong.off('duelInviteCanceled', handleDuelInviteCanceled);
			socketPong.off('duelInviteAnswered', handleDuelInviteAnswered);
			socketPong.off('joinDuel', handleJoinDuel);
			socketPong.off('GameError', handleGameError);
    	}

	}, []);


	//////////////////////////// <PONG INVITES/> //////////////////////////////


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
                  <input type="password" placeholder="Password" value={ChanMdp} onChange={(e) => setChanMdp(e.target.value)} />
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
                <input type="password" placeholder="Password" value={ChanMdpTo} onChange={(e) => setChanMdpTo(e.target.value)} />
                <button type="submit" className="add-message-button" >Join Channel</button>
              </form>
            </div>
          </div>
        </div>
        <div className="chat-app__main">
          <div className="channel-header">
            <h2>{GeneralName || 'General'}</h2>
            {selectedChannel && <button className="add-message-button" onClick={FormAdmin}>Manage admin</button>}
            {AdminOn && <form onSubmit={AddAdmin} >
              <input type="text" placeholder="New admin" value={AdminName} onChange={(e) => setAdminName(e.target.value)} />
              <button className="add-message-button" type="submit" >Add admin</button>
            </form>
            }
            {AdminOn && <form onSubmit={DelAdmin} >
              <input type="text" placeholder="del admin" value={AdminToDel} onChange={(e) => setAdminToDel(e.target.value)} />
              <button className="add-message-button" type="submit"  >Del admin</button>
            </form>
            }

            {selectedChannel && <button className="add-message-button" onClick={Sanction}>Manage Sanction</button>}
            {SanctionManger && <form onSubmit={Unban} >
              <input type="text" placeholder="Unban user" value={UserToUnBan} onChange={(e) => setUserToUnBan(e.target.value)} />
              <button className="add-message-button" type="submit"  >Unban</button>
            </form>
            }
            {SanctionManger && <form onSubmit={UnMute} >
              <input type="text" placeholder="Unmute user" value={UserToUnMute} onChange={(e) => setUserToUnMute(e.target.value)} />
              <button className="add-message-button" type="submit"  >Unmute</button>
            </form>
            }
            {selectedChannel && <button className="add-message-button" onClick={OpenNewMdp}>Change password</button>}
            {openNewMdp && <form onSubmit={ChangePassword} >
              <input type="password" placeholder="New password" value={newMdp} onChange={(e) => setNewMdp(e.target.value)} />
              <button className="add-message-button" type="submit"  >OK</button>
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
                maxLength={134}
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
              <li className="active" key={user.uid} onClick={() => OpenUser(user.uid, user.name)} >
                {user.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="Invitation-list__sidebar">
          <h1>Channel invite</h1>
          <ul className="containers">

            {ChanInvite.map((user) => (
              <li className="active" key={user.id}  >
                {user.name}
              </li>
            ))}
          </ul>
        </div>
        {/* </div> */}
    </div>    <ToastContainer />  
      </div>
  );
}
