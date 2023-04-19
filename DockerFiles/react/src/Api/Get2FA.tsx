import axios from 'axios'
import { urls } from "../global"
import { SetParamsToGetPost } from '../Headers/HeaderManager';
export async function Get2FA()
{
    const config : any = SetParamsToGetPost()
    let ret = await axios.get(`${urls.SERVER}/auth/set2FA`, config)
    return(ret);
}  
