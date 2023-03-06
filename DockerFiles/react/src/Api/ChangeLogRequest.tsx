import axios from 'axios';
import { urls } from "../global";
import { VraimentIlSaoule } from '../aurelcassecouilles/VraimentIlEstCasseCouille';



export async function RequestChangeLogin(wait : any)
{
    const config = VraimentIlSaoule()
    console.log(`btaunez ${config}`)
    return await axios.post(`${urls.SERVER}/auth/loginchnage`, wait, config)
}  
