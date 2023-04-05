import react from 'react'
import axios from 'axios'
import { urls } from "../global"
import { VraimentIlSaoule2 } from '../aurelcassecouilles/VraimentIlEstCasseCouille';
export async function PicGetRequest()
{
    const config : any = VraimentIlSaoule2()
    let ret = await axios.get(`${urls.SERVER}/auth/avatar`, config);
    return(ret);
}
