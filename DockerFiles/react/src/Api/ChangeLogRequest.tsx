import axios from 'axios';
import { urls } from "../global";
import { VraimentIlSaoule } from '../aurelcassecouilles/VraimentIlEstCasseCouille';

import io from 'socket.io-client';



export async function RequestChangeLogin(wait : any)
{
<<<<<<< HEAD
    let config = VraimentIlSaoule()
    console.log(`btaunez ${config.headers.Authorization}`)
    console.log(`ptn de sa mere : ${urls.SERVER}`)
    return await axios.post(`${urls.SERVER}/auth/loginchange`, wait, config)
} 
=======
    const config = VraimentIlSaoule()
    //return await axios.post(`http://localhost:3630/auth/loginchange`, wait, config)
	const newSocket = io("http://localhost:3631",
	{
  		auth:
		{
    		token: "$2b$10$8g5hRoRAnulG6sHtCcYjF.U5Z7.QJ63e6dFrN3zmUtnL0R7dlMRUm" //aurel
    		//token: "$2b$10$QeZgSMwqa.lTxA5l7/bz8uxLrLJBGzsLOSaZ4OfXYYKUu5iebkdD6" //charle
		}
	});
	console.log("le message send = " + wait);
	let ret = await newSocket.emit('newlink', wait);
	newSocket.on('newlink', (msg) =>
	{
		console.log("msg = " + msg);
	});
	/*let rett = await newSocket.emit('sendfriendrequest', wait);
	newSocket.on('sendfriendrequest', (msg) =>
	{
		console.log("msg = " + msg);
	});*/

	let rettt = await newSocket.emit('acceptfriendrequest', wait);
	newSocket.on('acceptfriendrequest', (msg) =>
	{
		console.log("msg = " + msg);
	});

	//console.log("ret = " + ret, { depth: null});
    //return await axios.post(`http://localhost:3630/auth/loginchange`, wait, config)
}  
>>>>>>> master
