import react from 'react'
import axios from 'axios'
import { urls } from "../global"
import { VraimentIlSaoule } from '../aurelcassecouilles/VraimentIlEstCasseCouille';


export async function GetPrivMsg(user : string)
{
    const config : any = VraimentIlSaoule()
    let ret = await axios.get(`${urls.SERVER}/main/resumeprivate/${user}`, config);
    return(ret);
}
