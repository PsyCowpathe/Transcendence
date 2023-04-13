import react from 'react'
import axios from 'axios'
import { urls } from "../global"
import { VraimentIlSaoule3 } from '../Headers/VraimentIlEstCasseCouille';


export async function GetChannelInfo(Channel : string)
{
    
    const config : any = VraimentIlSaoule3(Channel)
    let ret = await axios.get(`${urls.SERVER}/main/resumechannel`, config);
    return(ret);
}
