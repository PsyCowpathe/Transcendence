
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FaCog } from 'react-icons/fa';
import '../css/Buttons.css';
import { useNavigate } from 'react-router-dom'
import { TopBar } from './NavBar';
import { useEffect, useState } from 'react';
import { PicGetRequest } from '../Api/PicGetRequest';
import { GetUserInfo } from '../Api/GetUserInfo';
import React from 'react';
import PicModal from '../Modale/PicModale';
import LoginModal from '../Modale/LoginModal';
import '../css/UserPage.css';
import ModalSet2FA from '../Modale/Modal2FA';
import '../css/sidebar_info.css'
import '../css/styleUser.css'
import { GetFriendList } from '../Api/GetFriendList';
import { GetInvitationList } from '../Api/GetInvitationList';
import socketManager from '../MesSockets';
import { SetParamsToGetPost } from '../Headers/HeaderManager';
import { GetBlockList } from '../Api/GetBlockedList';
let test: boolean = false
let socket: any
let tt: boolean = true



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
    await GetFriendList()
      .then((res) => {
        console.log("Friendlist")
        console.log(res)
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
        console.log("Blocklist")
        console.log(res)
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
        console.log("Invitation list")
        console.log(res)
        setInvit(res.data.map((name: any) => {
          return { id: name.id, name: name.name }
        }
        ))
        console.log(invit)
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
  const [Pic, setPicUrl] = useState(localStorage.getItem('ProfilPic') || "Profil")

  // setPicUrl(localStorage.getItem('ProfilPic') || "Profil")
  useEffect(() => {
    console.log("Use effect de la photo")
    PicGetRequest(UserID)
      .then((res) => {
        console.log("|")
        console.log(res)
        console.log("|")
        const url = window.URL.createObjectURL(new Blob([res.data]));
        localStorage.setItem('ProfilPic', url)
        setPicUrl(url)
        console.log(Pic)
        setPic("oui")
      })
      .catch((err) => {
        console.log("ERROR")
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
      console.log("coucou1")
    // if (redirected) {
    //   return
    // }
    console.log("coucou2")

    GetUserInfo(UserID)
      .then((res) => {
        setUser({ name: res.data.name, victory: res.data.Victory, defeate: res.data.Defeat, gameplayed: res.data.Match })
        console.log("GetUserInfo ------------------------------------------------------------")
        console.log(res)
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
    console.log("ass")
    setRedirected(!redirected)
    setClickLog(!ClickLog)

  })


  const CloseMod = () => {
    console.log("-------------------Q--------------------")
    setClick(!Click)
    console.log(Click)
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


  if (tt === true && socket && socket.connected !== false) {
    tt = false;
  }
  if (tt === true) {
    socket = socketManager.getFriendRequestSocket()
    console.log(socket)
    if (socket == null) {
      if (test === false && SetParamsToGetPost().headers.Authorization !== null) {
        socket = socketManager.initializeFriendRequestSocket(SetParamsToGetPost().headers.Authorization)
        console.log(socket)
        test = true
      }
    }
    if (socket && socket.connected !== false) {
      tt = false;
    }
    console.log(socket)
  }

  interface user {
    user: number;
  }


  const MyCustomToast = ({ response, Acceptnow, Refusednow, closeToast }: any) => {
    return (
      <div>
        <p> {response.message}</p>
        <button onClick={() => { Acceptnow(response); closeToast() }}>Accept</button>
        <button onClick={() => { Refusednow(response); closeToast() }}>Refuse</button>
      </div>
    );
  };




  useEffect(() => {
    const handleFriendRequest = (response: any) => {
      MAJList()


      console.log("response")
      toast.success(response, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        progressClassName: "my-progress-bar"
      })
    }
    const handleErrorRequest = (response: any) => {
      MAJList()

      console.log(response)
      toast.error(response, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        progressClassName: "my-progress-bar"
      })
    }

    const handleFriendRequestSpe = (response: any) => {
      MAJList()
      if (response.message === `${response.user} send you a friend request !`) {
        toast.success(<MyCustomToast response={response} Acceptnow={Acceptnow} Refusednow={Refusednow} usera={userAc} closeToast={toast.dismiss} />,
          {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
            progressClassName: "my-progress-bar"
          })
      }
      else {
        toast.success(response, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
          progressClassName: "my-progress-bar"
        })

      }
    }
    socket.removeListener('sendfriendrequest');
    socket.removeListener('acceptfriendrequest');
    socket.removeListener('refusefriendrequest');
    socket.removeListener('blockuser');
    socket.removeListener('deletefriend');
    socket.removeListener('unblockuser');
    socket.removeListener('RelationError');

    socket.on("sendfriendrequest", handleFriendRequestSpe);
    socket.on("refusefriendrequest", handleFriendRequest);
    socket.on("blockuser", handleFriendRequest);
    socket.on("deletefriend", handleFriendRequest);
    socket.on("unblockuser", handleFriendRequest);
    socket.on("acceptfriendrequest", handleFriendRequest);
    socket.on("RelationError", handleErrorRequest);

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
    console.log("DELETE :")
    console.log(user)
    await socket.emit("deletefriend", { user });
  }
  const Changedelete = ((event: any) => {
    setUserdelete({ user: event.target.value })
  })

  ///////////////////////////////////////////////////////////////////////// request unblock      ///////////////////////////////////////////////////////



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
          Visiter mon site web
        </a>
      </div>

      <form action="submit" onSubmit={AskRequest}>
        <input

          value={userAsk.user}
          type="text"
          placeholder='friend request'
          onChange={ChangeAsk}
        />
        <button className="settings-button-icon">send</button>
      </form>

        

      <div>
        <button className="settings-button-icon" onClick={set2FA}>Set 2FA</button>
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
            <li key={Block.id}>{Block.name} <button className={"add-message-button"}onClick={() => unblock(Block.id)}>unblock</button></li>
          ))}
        </ul>
      </div>
      <ToastContainer />
    </div>
  );
}