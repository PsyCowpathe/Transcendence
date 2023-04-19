import axios from 'axios'
import { urls } from "../global"
import { SetParamsToGetPost } from '../Headers/HeaderManager';


export async function GetChannelList()
{
    const config : any = SetParamsToGetPost()
    let ret = await axios.get(`${urls.SERVER}/main/channellist`, config);
    return(ret);
}
