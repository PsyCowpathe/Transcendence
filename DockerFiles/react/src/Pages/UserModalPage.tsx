
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import React from 'react';
import '../css/Buttons.css';
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { PicGetRequest } from '../Api/PicGetRequest';
import { GetUserInfo } from '../Api/GetUserInfo';
import socketManager from '../MesSockets';
import { SetParamsToGetPost } from '../Headers/HeaderManager';
import MatchHistMod from '../Modale/MatchHystoriModal';
let test : boolean = false;
let tt : boolean = true;
let test2 : boolean = false;
interface User {
  name: string;
  uid: number;
}


interface user
{
  isConnect : string;
  name : string;
  victory : string;
  defeate : string;
  gameplayed : string;
}


export function AffTheUser({User, Channel} : {User : User, Channel : string  | null}) 
{
  console.log("Channel name")
  // console.log(User)
  console.log(User)
  const [user, setUser] = useState<user>({name: "?", victory: "0", defeate: "0", gameplayed: "0", isConnect: "Offline"})
    const [status , setStatus] = useState<string>("Online")
    const [ShowBan, setShowBan] = useState<boolean>(false)
    const [timer , setTimer] = useState<number>(0)
    const [reason, setReason] = useState<string>("")
    let socketFr = socketManager.getFriendRequestSocket();
    const socket = socketManager.getChatSocket();
    let socketCo = socketManager.getStatusSocket();

    console.log("socket")
    if (socketCo == null) {
    console.log(socketCo)

    if (test === false && SetParamsToGetPost().headers.Authorization !== null) {
      socketCo = socketManager.initializeStatusSocket(SetParamsToGetPost().headers.Authorization)
      socketCo = socketManager.getStatusSocket();
      
      console.log("socket")
      console.log(socketCo)
      test = true
    }
  }

  if (tt === true && socketFr && socketFr.connected !== false) {
    tt = false;
  }
  if (tt === true) {
    socketFr = socketManager.getFriendRequestSocket()
    console.log(socketFr)
    if (socketFr == null) {
      if (test2 === false && SetParamsToGetPost().headers.Authorization !== null) {
        socketFr = socketManager.initializeFriendRequestSocket(SetParamsToGetPost().headers.Authorization)
        console.log(socketFr)
        test2 = true
      }
    }
    if (socketFr && socketFr.connected !== false) {
      tt = false;
    }
    console.log(socketFr)
  }
  useEffect(() => {

    const handleBanUser = (data : any) => {
      console.log("COUCOUUUUUUUUUUUUUUUUUUUUUU U A UN BANNNNNN")
      toast.success(data, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        progressClassName: "my-progress-bar"
      })
    }

    const handleDeco = (data : any) => {
      if (data.user === User.name && data.status === "Offline")
        setStatus("Offline")
      if (data.user === User.name && data.status === "Online")
        setStatus("Online")
    }
    const handleFriendRequest = (response: any) => {
      console.log("response----------------------------------------------------------")
      toast.success(response, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        progressClassName: "my-progress-bar"
      })
    }
    socket.removeListener("banuser", handleBanUser);
    socketFr.removeListener('blockuser');
    socketCo.removeListener("status", handleDeco)
    socketCo.on("status", handleDeco)
    socketFr.on("blockuser", handleFriendRequest);

    socket.on("banuser", handleBanUser);
    return () => {
      socketCo.off("status", handleDeco)
      socket.off("blockuser");

      socketFr.off("banuser", handleBanUser);
    };

    }, [])


  const [redirected, setRedirected] = useState(false)

  useEffect(() => {
    if (redirected) {
      return
    }

    GetUserInfo(User.uid)
      .then((res) => {
        setUser({name: res.data.name, victory: res.data.Victory, defeate: res.data.Defeat, gameplayed: res.data.Match, isConnect: res.data.Status})
        setStatus(res.data.Status)
        console.log("coucoucBITE")
        console.log(res.data.Status)
        console.log(res)
      })
      .catch((err) => {
        console.log("ICI////////////////////////ICI")
        toast.error(err.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
          progressClassName: "my-progress-bar"
        })
          if(err.response)
        {
        if (err.message !== "Request aborted")
        {
          if (err.message !== "Request aborted") {
            if (err.response.data.message === "Invalid user" || err.response.data.message === "Invalid Bearer token")// erreur de token ==> redirection vers la page de change login
              navigate('/')
            if (err.response.data.message === "User not registered")// ==> redirection vers la page de register
            navigate('/Change')
            if(err.response.data.message === "Invalid 2FA token") //erreur de 2FA ==> redirection vers la page de 2FA
              navigate('/Send2FA')
          }
        }
      }
      })
  }, [redirected])



    const [PicUp, setPic] = React.useState("non")
     let Pic : any = localStorage.getItem(`UserPic${User.uid}`)
    // if(Pic === null)
    // {
    //   Pic = Profil
    // }
  const [redirectedd, setRedirectedd] = useState(false)

    useEffect(() =>
    {
      if (redirectedd) {
        return
      } 
      console.log("Use effect de la photo")
      console.log(User.uid)
      PicGetRequest(User.uid)
      .then((res) =>
      {
        console.log("|")
        console.log(res)
        console.log("|")
        const url = window.URL.createObjectURL(new Blob([res.data]));
        localStorage.setItem(`UserPic${User.uid}`, url)
        
  
        setPic("oui")
      })
      .catch((err) =>
      {
        console.log("ERROR")
        toast.error(err, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
          progressClassName: "my-progress-bar"
      })

        if (err.response)
        {
        if (err.message !== "Request aborted") {
          if (err.response.data.message === "Invalid user" || err.response.data.message === "Invalid Bearer token")// erreur de token ==> redirection vers la page de change login
            navigate('/')
          if (err.response.data.message === "User not registered")// ==> redirection vers la page de register
          navigate('/Change')
          if(err.response.data.message === "Invalid 2FA token") //erreur de 2FA ==> redirection vers la page de 2FA
            navigate('/Send2FA')
        }
      
      }
      })
    }, [redirectedd])
  
  
    
    const UserName : any= localStorage.getItem('name')
    // const UserUID : any= localStorage.getItem('UID')
    console.log(UserName)
  
 ////////////////////////////////////////////////////////BAN   
    
 const Ban = (e : React.FormEvent<HTMLFormElement>) =>
 {
   e.preventDefault()
   console.log(User)
   console.log(Channel)
   socket.emit("banuser", { id: User.uid, channelname: Channel, time: timer, reason: reason })
   setReason("")
   setTimer(0)
   setShowBan(!ShowBan)
   
  }
  const onClickTwo = (() =>
  {
    setShowBan(!ShowBan)
      setShowKick(false)
  setShowMute(false)
  })

/////////////////////////////////////////////////////BLOCK



const block = async () => {
  console.log("BLOCK :")
  const num : number = User.uid
  console.log("WTF" + num)
  await socketFr.emit("blockuser", { user : num } );
}
//////////////////////////////////////////////////////MUTE
const Mute =  (e : React.FormEvent<HTMLFormElement>) =>
{
  e.preventDefault()
  if (Channel !== '')
    socket.emit("muteuser", { id: User.uid, channelname: Channel, time: timer, reason: reason })

  setReason("")
  setTimer(0)
  setShowMute(!ShowMute)

}

const [ShowMute, setShowMute] = useState<boolean>(false)
const onClickTree = (() =>
{
  setShowMute(!ShowMute)
  setShowBan(false)
  setShowKick(false)
})

//////////////////////////////////////////////////////KICK
// -kickuser (nom de l’user a kick, nom du channel, raison)
const Kick =  (e : React.FormEvent<HTMLFormElement>) =>
{
  e.preventDefault()
  const uii : number =  User.uid.valueOf()
  console.log(uii)
  if (Channel !== '')
    socket.emit("kickuser", { id: uii, channelname: Channel, reason: reason })

  setReason("")
  setShowKick(!ShowKick)

}
const DuelManager = () =>
{
  alert("WoW")
}

const [ShowKick, setShowKick] = useState<boolean>(false)
const onClickfour = (() =>
{
  setShowKick(!ShowKick)
  setShowMute(false)
  setShowBan(false)
})

const navigate = useNavigate();
const [activeHist, setActiveHist] = useState<boolean>(false)

const ActiveHist = () =>
{
  setActiveHist(!activeHist)
}






return(
    <div className="App">

 <img src={Pic} alt="Profile" style={{ borderRadius: "50%", width: "200px", height: "200px", objectFit: "cover", boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)" }} />
 <div className="person-stats-mod">
      <h2>{user.name}</h2>
      <div className="status-indicator">
      <div className={status === "Online"? 'green-dot' : 'red-dot'}></div>
      <span>{status =="Online" ? 'Online' : 'Offline'}</span>
    </div>
      <p className="matches-played">Matches played: {user.gameplayed}</p>
      <p className="matches-won">Matches won: {user.victory}</p>
      <p className="matches-lost">Matches lost: {user.defeate}</p>
       <button className="add-message-button" onClick={ActiveHist}>Match History</button> 
      {activeHist && <MatchHistMod onClose={ActiveHist} User={User} />}
    </div>
  <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
    <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"><button style={{ fontSize: "1.2em", padding: "0.5em 2em", borderRadius: "5px", backgroundColor: "#4285F4", color: "#FFFFFF", border: "none", boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)", cursor: "pointer" }}>Visiter mon site web</button></a>
  {!ShowBan && <button className="add-message-button" onClick={onClickTwo}>Ban</button>}
      {ShowBan && 
      <div>

      <form  onSubmit={Ban}>
      <input type="text" placeholder="reason" value={reason} onChange={(e) => {setReason(e.target.value)}} />
      <input type="number" placeholder="0" value={timer} onChange={(e) => {setTimer(parseInt(e.target.value))}} />
      <button className="add-message-button" >Ban</button>
      </form>
    </div>
      } 
  {!ShowMute && <button className="add-message-button" onClick={onClickTree}>Mute</button>}
     {ShowMute && 
      <div>
      <form  onSubmit={Mute}>
      <input type="text" placeholder="reason" value={reason} onChange={(e) => {setReason(e.target.value)}} />
      <input type="number" placeholder="0" value={timer} onChange={(e) => {setTimer(parseInt(e.target.value))}} />
      <button className="add-message-button">Mute</button>
      </form>
    </div>
      } 
      <button className= "add-message-button"onClick={block}>Block</button>
      {!ShowKick && <button className="add-message-button" onClick={onClickfour}>Kick</button>}
     {ShowKick && 
      <div>
      <form  onSubmit={Kick}>
      <input type="text" placeholder="reason" value={reason} onChange={(e) => {setReason(e.target.value)}} />
      <button className="add-message-button">Kick</button>
      </form>
    </div>
      } 
      <button  className="add-message-button"onClick={DuelManager}>DUEL</button>


  </div><ToastContainer/>
</div>
);
}

function isnum(uid: number) {
  throw new Error('Function not implemented.');
}
