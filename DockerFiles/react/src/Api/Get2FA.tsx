import react from 'react'
import axios from 'axios'
import { urls } from "../global"
import { VraimentIlSaoule2 } from '../aurelcassecouilles/VraimentIlEstCasseCouille';
export async function Get2FA()
{
    const config : any = VraimentIlSaoule2()
    let ret = await axios.get(`${urls.SERVER}/auth/set2FA`, config)
    return(ret);
}
