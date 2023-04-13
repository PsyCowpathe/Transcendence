import axios from 'axios';
import { urls } from "../global";
import { SetParamsToGetPost } from '../Headers/VraimentIlEstCasseCouille';



export async function RequestChangeLogin(wait : any)
{
    let config = SetParamsToGetPost()
    console.log(`btaunez ${config.headers.Authorization}`)
    console.log(`ptn de sa mere : ${urls.SERVER}`)
    return await axios.post(`${urls.SERVER}/auth/loginchange`, wait, config)
} 
