import react from 'react'
import axios from 'axios'
import { urls } from "../global"
import { VraimentIlSaoule } from '../Headers/VraimentIlEstCasseCouille';
export async function GetUserInfo(UserName : number)
{
    const config : any = VraimentIlSaoule()
    let ret = await axios.get(`${urls.SERVER}/main/getuserinfos/${UserName}`, config);
    return(ret);
}
