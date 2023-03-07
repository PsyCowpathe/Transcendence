import axios from 'axios';
import { urls } from "../global";
import { VraimentIlSaoule } from '../aurelcassecouilles/VraimentIlEstCasseCouille';

import io from 'socket.io-client';



export async function RequestChangeLogin(wait : any)
{
    const config = VraimentIlSaoule()
    console.log(`btaunez ${config}`)
    //return await axios.post(`http://localhost:3631/events`, config)
	const newSocket = io("http://localhost:3631/");
	let ret = newSocket.emit('events');
	console.log("ret = " + ret, { depth: null});
    //return await axios.post(`http://localhost:3630/auth/loginchange`, wait, config)
}  
