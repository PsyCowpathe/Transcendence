import axios from 'axios'
import { urls } from "../global"
import { VraimentIlSaoule } from '../Headers/VraimentIlEstCasseCouille';

export async function GetFriendList()
{
    const config : any = VraimentIlSaoule()
    let ret = await axios.get(`${urls.SERVER}/main/getfriends`, config);
    return(ret);
}
