import axios from 'axios'
import { urls } from "../global"
import { VraimentIlSaoule } from '../aurelcassecouilles/VraimentIlEstCasseCouille';

export async function GetFriendList()
{
    const config : any = VraimentIlSaoule()
    let ret = await axios.get(`${urls.SERVER}/auth/friendlist`, config);
    return(ret);
}
