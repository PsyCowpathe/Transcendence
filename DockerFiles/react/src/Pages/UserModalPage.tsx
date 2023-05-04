
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
let test: boolean = false;
let tt: boolean = true;
let test2: boolean = false;
let test3: boolean = false;

interface User {
  name: string;
  uid: number;
}


interface user {
  isConnect: string;
  name: string;
  victory: string;
  defeate: string;
  gameplayed: string;
}


export function AffTheUser({ User, Channel }: { User: User, Channel: string | null }) {
  const [user, setUser] = useState<user>({ name: "?", victory: "0", defeate: "0", gameplayed: "0", isConnect: "Offline" })
  const [status, setStatus] = useState<string>("Online")
  const [ShowBan, setShowBan] = useState<boolean>(false)
  const [timer, setTimer] = useState<number>(0)
  const [reason, setReason] = useState<string>("")


 

  let socketFr = socketManager.getFriendRequestSocket();
  let socketPong = socketManager.getPongSocket();
  const socket = socketManager.getChatSocket();
  let socketCo = socketManager.getStatusSocket();

  if (socketCo == null) {
    if (test === false && SetParamsToGetPost().headers.Authorization !== null) {
      socketCo = socketManager.initializeStatusSocket(SetParamsToGetPost().headers.Authorization)
      socketCo = socketManager.getStatusSocket();

      test = true
    }
  }
  if (socketPong == null) {
    if (test3 === false && SetParamsToGetPost().headers.Authorization !== null) {
      socketPong = socketManager.initializePongSocket(SetParamsToGetPost().headers.Authorization)
      socketPong = socketManager.getPongSocket();

      test3 = true
    }
  }

  if (tt === true && socketFr && socketFr.connected !== false) {
    tt = false;
  }
  if (tt === true) {
    socketFr = socketManager.getFriendRequestSocket()
    if (socketFr == null) {
      if (test2 === false && SetParamsToGetPost().headers.Authorization !== null) {
        socketFr = socketManager.initializeFriendRequestSocket(SetParamsToGetPost().headers.Authorization)
        test2 = true
      }
    }
    if (socketFr && socketFr.connected !== false) {
      tt = false;
    }
  }
  useEffect(() => {

    const handleBanUser = (data: any) => {
      toast.success(data, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        progressClassName: "my-progress-bar"
      })
    }

    const handleDeco = (data: any) => {
      if (data.id === User.uid && data.status === "Offline")
        setStatus("Offline")
      if (data.id === User.uid && data.status === "Online")
        setStatus("Online")
      if (data.id === User.uid && data.status === "InGame")
        setStatus("InGame")
    }
    const handleFriendRequest = (response: any) => {
      toast.success(response, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        progressClassName: "my-progress-bar"
      })
    }
    socket.removeListener("banuser", handleBanUser);
    socketFr.removeListener('blockuser');
    socketCo.removeListener("status", handleDeco)
    socketPong.removeListener("status", handleDeco)
    socketCo.on("status", handleDeco)
    socketPong.on("status", handleDeco)
    socketFr.on("blockuser", handleFriendRequest);

    socket.on("banuser", handleBanUser);
    return () => {
      socketCo.off("status", handleDeco)
      socketPong.off("status", handleDeco)
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
        
        setUser({ name: res.data.name, victory: res.data.Victory, defeate: res.data.Defeat, gameplayed: res.data.Match, isConnect: res.data.Status })
        setStatus(res.data.Status)
      })
      .catch((err) => {
        toast.error(err.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
          progressClassName: "my-progress-bar"
        })
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
  }, [redirected])



  const [PicUp, setPic] = React.useState("non")
  const [Pic, setPicUrl] = useState("")

   
    const [redirectedd, setRedirectedd] = useState(false)

    useEffect(() => {
      if (redirectedd) {
        return  
      }
      PicGetRequest(User.uid)
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          localStorage.setItem(`UserPic${User.uid}`, url)

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
    }, [redirectedd])



  const UserName: any = localStorage.getItem('name')
  // const UserUID : any= localStorage.getItem('UID')

  ////////////////////////////////////////////////////////BAN   

  const Ban = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    socket.emit("banuser", { id: User.uid, channelname: Channel, time: timer, reason: reason })
    setReason("")
    setTimer(0)
    setShowBan(!ShowBan)

  }
  const onClickTwo = (() => {
    setShowBan(!ShowBan)
    setShowKick(false)
    setShowMute(false)
  })

  /////////////////////////////////////////////////////BLOCK



  const block = async () => {
    const num: number = User.uid
    await socketFr.emit("blockuser", { user: num });
  }
  //////////////////////////////////////////////////////MUTE
  const Mute = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (Channel !== '')
      socket.emit("muteuser", { id: User.uid, channelname: Channel, time: timer, reason: reason })

    setReason("")
    setTimer(0)
    setShowMute(!ShowMute)

  }

  const [ShowMute, setShowMute] = useState<boolean>(false)
  const onClickTree = (() => {
    setShowMute(!ShowMute)
    setShowBan(false)
    setShowKick(false)
  })

  //////////////////////////////////////////////////////KICK
  // -kickuser (nom de l’user a kick, nom du channel, raison)
  const Kick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const uii: number = User.uid.valueOf()
    if (Channel !== '')
      socket.emit("kickuser", { id: uii, channelname: Channel, reason: reason })

    setReason("")
    setShowKick(!ShowKick)

  }
  const DuelManager = () => {
    alert("WoW")
  }

  const [ShowKick, setShowKick] = useState<boolean>(false)
  const onClickfour = (() => {
    setShowKick(!ShowKick)
    setShowMute(false)
    setShowBan(false)
  })

  const navigate = useNavigate();
  const [activeHist, setActiveHist] = useState<boolean>(false)

  const ActiveHist = () => {
    setActiveHist(!activeHist)
  }


	const sendDuelInvite = () =>
	{
		socketPong.emit('sendDuel', { input: User.uid });
		console.log("you challenged " + User.name +  " to a pong duel");
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

		function joinDuel()
		{
			navigate('/pong/play');
		}

		const handleJoinDuel = () =>
		{
			joinDuel();
		};
		socketPong.removeListener('joinDuel');

		socketPong.on('joinDuel', handleJoinDuel);

	    return () => {
			socketPong.off('joinDuel', handleJoinDuel);
    	}

	}, []);


	//////////////////////////// <PONG INVITES/> //////////////////////////////

	
  return (
    <div className="App">
      <img src={Pic} alt="Profile" style={{ borderRadius: "50%", width: "200px", height: "200px", objectFit: "cover", boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)" }} />
      <div className="person-stats-mod">
        <h2>{user.name}</h2>
        <div className="status-indicator">
          <div className={status === "Offline" ? 'red-dot' : 'green-dot'}></div>
          <span>{status}</span>
        </div>
        <p className="matches-played">Matches played: {user.gameplayed}</p>
        <p className="matches-won">Matches won: {user.victory}</p>
        <p className="matches-lost">Matches lost: {user.defeate}</p>
        <button className="add-message-button" onClick={ActiveHist}>Match History</button>
        {activeHist && <MatchHistMod onClose={ActiveHist} User={User} />}
      </div>
      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"><button style={{ fontSize: "1.2em", padding: "0.5em 2em", borderRadius: "5px", backgroundColor: "#4285F4", color: "#FFFFFF", border: "none", boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)", cursor: "pointer" }}>Check out my website</button></a>
        {!ShowBan && <button className="add-message-button" onClick={onClickTwo}>Ban</button>}
        {ShowBan &&
          <div>

            <form onSubmit={Ban}>
              <input type="text" placeholder="reason" value={reason} onChange={(e) => { setReason(e.target.value) }} />
              <input type="number" placeholder="0" value={timer} onChange={(e) => { setTimer(parseInt(e.target.value)) }} />
              <button className="add-message-button" >Ban</button>
            </form>
          </div>
        }
        {!ShowMute && <button className="add-message-button" onClick={onClickTree}>Mute</button>}
        {ShowMute &&
          <div>
            <form onSubmit={Mute}>
              <input type="text" placeholder="reason" value={reason} onChange={(e) => { setReason(e.target.value) }} />
              <input type="number" placeholder="0" value={timer} onChange={(e) => { setTimer(parseInt(e.target.value)) }} />
              <button className="add-message-button">Mute</button>
            </form>
          </div>
        }
        <button className="add-message-button" onClick={block}>Block</button>
        {!ShowKick && <button className="add-message-button" onClick={onClickfour}>Kick</button>}
        {ShowKick &&
          <div>
            <form onSubmit={Kick}>
              <input type="text" placeholder="reason" value={reason} onChange={(e) => { setReason(e.target.value) }} />
              <button className="add-message-button">Kick</button>
            </form>
          </div>
        }
        <button className="add-message-button" onClick={sendDuelInvite}>DUEL</button>


      </div>   <ToastContainer /> 
    </div>
  );
}


