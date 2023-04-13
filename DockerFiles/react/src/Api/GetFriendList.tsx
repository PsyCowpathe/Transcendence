import axios from 'axios'
import { urls } from "../global"
import { SetParamsToGetPost } from '../Headers/VraimentIlEstCasseCouille';

export async function GetFriendList()
{
    const config : any = SetParamsToGetPost()
    let ret = await axios.get(`${urls.SERVER}/main/getfriends`, config);
    return(ret);
}
