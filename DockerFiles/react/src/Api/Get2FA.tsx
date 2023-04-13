import react from 'react'
import axios from 'axios'
import { urls } from "../global"
import { SetParamsToGetPost } from '../Headers/VraimentIlEstCasseCouille';
export async function Get2FA()
{
    const config : any = SetParamsToGetPost()
    let ret = await axios.get(`${urls.SERVER}/auth/set2FA`, config)
    return(ret);
}  
