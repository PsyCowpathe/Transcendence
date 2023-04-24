import axios from 'axios'
import { SetParamsToGetPost } from '../Headers/HeaderManager';
export async function Get2FA()
{
    const config : any = SetParamsToGetPost()
    let ret = await axios.get(`${process.env.REACT_APP_SERVER}:3630/auth/set2FA`, config)
    return(ret);
}  
