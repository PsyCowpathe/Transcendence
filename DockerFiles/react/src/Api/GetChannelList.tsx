import axios from 'axios'
import { SetParamsToGetPost } from '../Headers/HeaderManager';

export async function GetChannelList()
{
    const config : any = SetParamsToGetPost()
    let ret = await axios.get(`${process.env.REACT_APP_SERVER}:3630/main/channellist`, config);
    return(ret);
}
