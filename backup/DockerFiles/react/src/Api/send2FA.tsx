import axios from 'axios';
import { urls } from "../global";
import { SetParamsToGetPost } from '../Headers/HeaderManager';


export async  function  Send2FA(Code2FA  : any)
{
    const config = SetParamsToGetPost()
    const ret = axios.post(`${urls.SERVER}/auth/2FAlogin`, Code2FA, config)
    return ret
}