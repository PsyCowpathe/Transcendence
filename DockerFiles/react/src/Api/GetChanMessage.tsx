import react from 'react'
import axios from 'axios'
import { urls } from "../global"
import { SetParamsToGetPost3 } from '../Headers/VraimentIlEstCasseCouille';


export async function GetChannelInfo(Channel : string)
{
    
    const config : any = SetParamsToGetPost3(Channel)
    let ret = await axios.get(`${urls.SERVER}/main/resumechannel`, config);
    return(ret);
}
