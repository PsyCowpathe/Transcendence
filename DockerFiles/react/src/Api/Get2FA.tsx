import react from 'react'
import axios from 'axios'
import { urls } from "../global"
import { VraimentIlSaoule } from '../aurelcassecouilles/VraimentIlEstCasseCouille';
export async function Get2FA()
{
    const config : any = VraimentIlSaoule()
    let ret = await axios.get(`${urls.SERVER}/auth/set2FA`, config)
    return(ret);
}  
