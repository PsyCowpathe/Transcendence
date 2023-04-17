
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
import '../css/Buttons.css';
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { PicGetRequest } from '../Api/PicGetRequest';
import { GetUserInfo } from '../Api/GetUserInfo';
import socketManager from '../MesSockets';

interface User {
  name: string;
  uid: number;
}


interface user
{
  isConnect : boolean;
  name : string;
  victory : string;
  defeate : string;
  gameplayed : string;
}


export function AffTheUser({User, Channel} : {User : User, Channel : string  | null}) 
{
  console.log("Channel name")
  console.log(Channel)
  const [user, setUser] = useState<user>({name: "?", victory: "0", defeate: "0", gameplayed: "0", isConnect: false})
  
    const [ShowBan, setShowBan] = useState<boolean>(false)
    const [timer , setTimer] = useState<number>(0)
    const [reason, setReason] = useState<string>("")
    
    const socket = socketManager.getChatSocket();
  useEffect(() => {

    const handleBanUser = (data : any) => {
      toast.success(data, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        progressClassName: "my-progress-bar"
    })
    }

    const handleBanUsererror = (data : any) => {
      toast.error(data, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        progressClassName: "my-progress-bar"
    })
    }
    socket.on("banuser", handleBanUser);
    socket.on("ChatError", handleBanUsererror);
    return () => {
      socket.off("banuser", handleBanUser);
      socket.off("ChatError", handleBanUsererror);
    };

    }, [])


  const [redirected, setRedirected] = useState(false)

  useEffect(() => {
    if (redirected) {
      return
    }

    GetUserInfo(User.uid)
      .then((res) => {
        setUser({name: res.data.name, victory: res.data.Victory, defeate: res.data.Defeat, gameplayed: res.data.Match, isConnect: res.data.isConnect})

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
  if (Channel !== '')
    socket.emit("kickuser", { id: User.uid, channelname: Channel, reason: reason })

  setReason("")
  setShowKick(!ShowKick)

}

const [ShowKick, setShowKick] = useState<boolean>(false)
const onClickfour = (() =>
{
  setShowKick(!ShowKick)
  setShowMute(false)
  setShowBan(false)
})

const navigate = useNavigate();
/***************************************************************************POUR LEO LE DUEL PONG ********************************/
const DuelManager = () =>
{
  // => User.uid
  //socket.emit("TAROUTE", { id(ou name jsp comme tu l aura appeller dansle back): User.uid )

  alert("Duel Manager")



}
/***************************************************************************POUR LEO LE DUeK PONG ********************************/



return(
    <div className="App">

 <img src={Pic} alt="Profile" style={{ borderRadius: "50%", width: "200px", height: "200px", objectFit: "cover", boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)" }} />
 <div className="person-stats-mod">
      <h2>{user.name}</h2>
      <div className="status-indicator">
      <div className={user.isConnect ? 'green-dot' : 'red-dot'}></div>
      <span>{user.isConnect ? 'Connecté' : 'Déconnecté'}</span>
    </div>
      <p className="matches-played">Matches played: {user.gameplayed}</p>
      <p className="matches-won">Matches won: {user.victory}</p>
      <p className="matches-lost">Matches lost: {user.defeate}</p>
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