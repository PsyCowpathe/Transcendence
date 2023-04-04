import axios from 'axios';
import { urls } from "../global";
import { VraimentIlSaoule } from '../aurelcassecouilles/VraimentIlEstCasseCouille';



export async function UploadPicRequest(file : any)
{
    let config = VraimentIlSaoule()
    console.log(`btaunez ${config.headers.Authorization}`)
    console.log(`ptn de sa mere : ${urls.SERVER}`)
    return await axios.post(`${urls.SERVER}/auth/avatar`, file, config)
} 
