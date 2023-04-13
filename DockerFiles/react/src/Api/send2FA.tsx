import axios from 'axios';
import { urls } from "../global";
import { VraimentIlSaoule } from '../Headers/VraimentIlEstCasseCouille';


export async  function  Send2FA(Code2FA  : any)
{
    const config = VraimentIlSaoule()
    const ret = axios.post(`${urls.SERVER}/auth/2FAlogin`, Code2FA, config)
    return ret
}