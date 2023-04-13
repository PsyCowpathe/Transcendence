

import axios from 'axios'
import { urls } from "../global"
import { VraimentIlSaoule } from '../Headers/VraimentIlEstCasseCouille';

export async function GetInvitationList()
{
    const config : any = VraimentIlSaoule()
    let ret = await axios.get(`${urls.SERVER}/main/getfriendrequest`, config);
    return(ret);
}
