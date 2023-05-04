
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FaCog } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'
import { TopBar } from './NavBar';
import { useEffect, useState } from 'react';
import { PicGetRequest } from '../Api/PicGetRequest';
import { GetUserInfo } from '../Api/GetUserInfo';
import React from 'react';
import PicModal from '../Modale/PicModale';
import LoginModal from '../Modale/LoginModal';
import ModalSet2FA from '../Modale/Modal2FA';
import '../css/Buttons.css';
import '../css/UserPage.css';
import '../css/sidebar_info.css'
import '../css/styleUser.css'
import { GetFriendList } from '../Api/GetFriendList';
import { GetInvitationList } from '../Api/GetInvitationList';
import socketManager from '../MesSockets';
import { SetParamsToGetPost } from '../Headers/HeaderManager';
import { GetBlockList } from '../Api/GetBlockedList';



let socket: any
let socketStatus: any
let socketChat: any

export function AffMyUserPage({ ShowBar }: { ShowBar: boolean }) {

  interface User {
    name: string;
    victory: string;
    defeate: string;
    gameplayed: string;
  }

  
  interface friend {
    id: number
    name: string
    UID: string
  }
  const [friends, setFriend] = useState<friend[]>([])
  const [invit, setInvit] = useState<friend[]>([])
  const [blockedList, setBlockedList] = useState<friend[]>([])
  const [user, setUser] = useState<User>({ name: "?", victory: "0", defeate: "0", gameplayed: "0" })

  const MAJFriendList = async () => {
    console.log("je connect les flash bngo")
    await GetFriendList()
      .then((res) => {
        // setFriend([])
        setFriend(res.data.map((name: any) => {
          return { id: name.id, name: name.name }
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
      })
  }
  const MAJBlockList = async () => {
    await GetBlockList()
      .then((res) => {
        // setBlockedList([])
        setBlockedList(res.data.map((name: any) => {
          return { id: name.id, name: name.name }
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
      })
  }


  const MAJinvitationList = async () => {
    await GetInvitationList()
      .then((res) => {
        setInvit(res.data.map((name: any) => {
          return { id: name.id, name: name.name }
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
      })
  }

  const MAJList = async () => {
    await MAJFriendList()
    await MAJinvitationList()
    await MAJBlockList()
  }

  useEffect(() => {
    MAJList()
  }, [])



  const UserID: any = localStorage.getItem('UID')
  const [redirected, setRedirected] = useState(false)


  const [ClickLog, setClickLog] = useState(false)
  const [Clickde, setClickde] = useState(false)
  const [Click, setClick] = useState(false)
  const [PicUp, setPic] = React.useState("non")
  const [Pic, setPicUrl] = useState("")

  useEffect(() => {
    PicGetRequest(UserID)
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        localStorage.setItem('ProfilPic', url)
        setPicUrl(url)
        setPic("oui")
      })
      .catch((err) => {
        toast.error(err, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
          progressClassName: "my-progress-bar"
        })
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
  }, [Click])

  useEffect(() => {
    GetUserInfo(UserID)
      .then((res) => {
     
        setUser({ name: res.data.name, victory: res.data.Victory, defeate: res.data.Defeat, gameplayed: res.data.Match })
      })
      .catch((err) => {
        toast.error(err.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
          progressClassName: "my-progress-bar"
        })
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
  }, [redirected])

  const navigate = useNavigate();

  const onClick = (() => {
    setRedirected(!redirected)
    setClickLog(!ClickLog)

  })


  const CloseMod = () => {
    setClick(!Click)
  };

  const [open2FA, setopen2FA] = useState<boolean>(false)
  const set2FA = () => {
    setopen2FA(!open2FA)
  }


  /*************************************************************************************************/
  /*                                                                                               */
  /*                                                                                               */
  /*                                                                                               */
  /*                                         FRIEND REQUEST                                        */
  /*                                                                                               */
  /*                                                                                               */
  /*                                                                                               */
  /*                                                                                               */
  /*************************************************************************************************/
  socket = socketManager.getFriendRequestSocket();
  socketStatus = socketManager.getStatusSocket();
  socketChat = socketManager.getChatSocket();

  if (!socket) {
    const tokennn = SetParamsToGetPost().headers.Authorization;
    if (tokennn !== null) {
      socketManager.initializeFriendRequestSocket(tokennn);
      socket = socketManager.getFriendRequestSocket();
    }
  }

  if (!socketStatus) {
    const token = SetParamsToGetPost().headers.Authorization;
    if (token !== null) {
      socketManager.initializeStatusSocket(token);
      socketStatus = socketManager.getStatusSocket();
    }
  }

  if (!socketChat) {
    const tokenn = SetParamsToGetPost().headers.Authorization;
    if (tokenn !== null) {
      socketManager.initializeChatSocket(tokenn);
      socketChat = socketManager.getChatSocket();
    }
  }

  interface user {
    user: number;
  }

  useEffect(() => {
    const handleFriendRequest = (response: any) => {
      MAJList()
      toast.success(response, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        progressClassName: "my-progress-bar"
      })
    }
    const handleErrorRequest = (response: any) => {
      MAJList()
      toast.error(response, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        progressClassName: "my-progress-bar"
      })
    }

    const handleFriendRequestSpe = (response: any) => {
      MAJList()

      toast.success(response, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        progressClassName: "my-progress-bar"
      })
    }

    socket.removeListener('sendfriendrequest');
    socket.removeListener('acceptfriendrequest');
    socket.removeListener('refusefriendrequest');
    socket.removeListener('blockuser');
    socket.removeListener('deletefriend');
    socket.removeListener('unblockuser');
    socket.removeListener('RelationError');
    socketStatus.removeListener('status');

    socket.on("sendfriendrequest", handleFriendRequestSpe);
    socket.on("refusefriendrequest", handleFriendRequest);
    socket.on("blockuser", handleFriendRequest);
    socket.on("deletefriend", handleFriendRequest);
    socket.on("unblockuser", handleFriendRequest);
    socket.on("acceptfriendrequest", handleFriendRequest);
    socket.on("RelationError", handleErrorRequest);
    socketStatus.on("status", handleErrorRequest);

    return () => {
      socket.off("sendfriendrequest", handleFriendRequestSpe);
      socket.off("refusefriendrequest", handleFriendRequest);
      socket.off("blockuser", handleFriendRequest);
      socket.off("deletefriend", handleFriendRequest);
      socket.off("unblockuser", handleFriendRequest);
      socket.off("acceptfriendrequest", handleFriendRequest);
      socket.off("RelationError", handleErrorRequest);
    }
  }, [])

  ///////////////////////////////////////////////////////////////////////// request send      ///////////////////////////////////////////////////////
  interface user2 {
    user: string
  }
  const [userAsk, setUserAsk] = useState<user2>({ user: '' })
  /*FAIT*/

  const AskRequest = async (event: any) => {
    event.preventDefault()
    //emit  
    await socket.emit("sendfriendrequest", userAsk);
    setUserAsk({ user: '' })

  }
  const ChangeAsk = ((event: any) => {
    setUserAsk({ user: event.target.value })
  })



  ///////////////////////////////////////////////////////////////////////// request accept      ///////////////////////////////////////////////////////

  const [userAc, setUserAccept] = useState<user>({ user: 0 })//1
  /*FAIT*/

  const Accept = async (user: number) => {
    setUserAccept({ user: user })
    await socket.emit("acceptfriendrequest", { user });
  }

  const Acceptnow = async (userAs: user) => {
    await socket.emit("acceptfriendrequest", userAs);
  }

  ///////////////////////////////////////////////////////////////////////// request refused      ///////////////////////////////////////////////////////



  /*FAIT*/


  const Refused = async (user: number) => {
    await socket.emit("refusefriendrequest", { user });
  }


  const Refusednow = async (userRef: user) => {
    await socket.emit("refusefriendrequest", userRef);
  }

  ///////////////////////////////////////////////////////////////////////// request block      ///////////////////////////////////////////////////////

  /*FAIT*/


  const block = async (user: number) => {
    await socket.emit("blockuser", { user });
  }


  ///////////////////////////////////////////////////////////////////////// request delete      ///////////////////////////////////////////////////////

  const [userdelete, setUserdelete] = useState<user>({ user: 0 })//4

  /*FAIT*/

  const deleteU = async (user: number) => {
    await socket.emit("deletefriend", { user });
  }

  ///////////////////////////////////////////////////////////////////////// request unblock      ///////////////////////////////////////////////////////


  /*FAIT*/

  const unblock = async (user: any) => {
    await socket.emit("unblockuser", { user });

  }

  /*************************************************************************************************/
  /*                                                                                               */
  /*                                                                                               */
  /*                                                                                               */
  /*                                         FRIEND REQUEST                                        */
  /*                                                                                               */
  /*                                                                                               */
  /*                                                                                               */
  /*                                                                                               */
  /*************************************************************************************************/


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
    <div className="user-page">
      <TopBar />
      <div className="user-info">
        <div className="profile-pic-container">
          <img className="profile-pic" src={Pic} alt="Profile" />
          <button className="profile-pic-button" onClick={CloseMod}>
            Change your image
          </button>
          {Click && <PicModal onClose={CloseMod} />}
        </div>
        <div className="user-details">
          {/* 
          <h1 className="user-name">{UserName}</h1>
          <p className="user-age-ville">Age | Ville</p>
           */}
          <div className="person-stats">
            <h2>{user.name}</h2>
            <p className="matches-played">Matches played: {user.gameplayed}</p>
            <p className="matches-won">Matches won: {user.victory}</p>
            <p className="matches-lost">Matches lost: {user.defeate}</p>
          </div>
          <button className="settings-button" onClick={onClick}>
            <FaCog className="settings-button-icon" />
            <span>Change your login</span>
          </button>
          {ClickLog && <LoginModal onClose={onClick} />}
        </div>
      </div>
      <div className="user-buttons">
        <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="user-button">
          Checkout my website
        </a>
      </div>

      <form action="submit" onSubmit={AskRequest}>
        <input

          value={userAsk.user}
          type="text"
          placeholder='friend request'
          onChange={ChangeAsk}
        />
        <button className="user-button">send</button>
      </form>

     

      <div>
        <button className="user-button" onClick={set2FA}>Set 2FA</button>
        {open2FA && <ModalSet2FA onClose={set2FA} />}
      </div>
      <div className="friends-list">
        <h3>Friends</h3>
        <ul>
          {friends.map((friend) => (
            <li key={friend.id}>{friend.name} <button className="reject-btn" onClick={() => deleteU(friend.id)}>delete</button> <button className="reject-btn" onClick={() => block(friend.id)}>block</button></li> ////chabge css button is horrible
          ))}
        </ul>
      </div>
      <div className="Invitation-list">
        <h3>Invitation</h3>
        <ul>
          {invit.map((invite) => (
            <li key={invite.id}>{invite.name} <button className="reject-btn" onClick={() => Refused(invite.id)}>refuse</button> <button className="accept-btn" onClick={() => Accept(invite.id)}>Accept</button> </li>
          ))}
        </ul>
      </div>
      <div className="Blocked-list">
        <h3>Blocked Users</h3>
        <ul>
          {blockedList.map((Block) => (
            <li key={Block.id}>{Block.name} <button className={"add-message-button"} onClick={() => unblock(Block.id)}>unblock</button></li>
          ))}
        </ul>
      </div>
          <ToastContainer />  
    </div>
  );
}
