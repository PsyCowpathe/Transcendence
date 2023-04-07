import react from 'react'
import axios from 'axios'
import { urls } from "../global"
import { VraimentIlSaoule } from '../aurelcassecouilles/VraimentIlEstCasseCouille';


export async function GetChannelInfo(Channel : string)
{
    const config : any = VraimentIlSaoule()
    let ret = await axios.get(`${urls.SERVER}/auth/resumechannel/${Channel}`, config);
    return(ret);
}
