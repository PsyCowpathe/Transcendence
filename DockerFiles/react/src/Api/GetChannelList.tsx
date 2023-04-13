import react from 'react'
import axios from 'axios'
import { urls } from "../global"
import { VraimentIlSaoule } from '../Headers/VraimentIlEstCasseCouille';


export async function GetChannelList()
{
    const config : any = VraimentIlSaoule()
    let ret = await axios.get(`${urls.SERVER}/main/channellist`, config);
    return(ret);
}
