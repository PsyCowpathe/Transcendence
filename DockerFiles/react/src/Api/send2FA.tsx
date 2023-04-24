import axios from 'axios';
import { SetParamsToGetPost } from '../Headers/HeaderManager';

export async  function  Send2FA(Code2FA  : any)
{
    const config = SetParamsToGetPost()
    const ret = axios.post(`${process.env.REACT_APP_SERVER}:3630/auth/2FAlogin`, Code2FA, config)
    return ret
}
