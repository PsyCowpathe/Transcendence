import axios from 'axios'
import { SetParamsToGetPost } from '../Headers/HeaderManager';

export async function GetInvitationList()
{
    const config : any = SetParamsToGetPost()
    let ret = await axios.get(`${process.env.SERVER}:3630/main/getfriendrequest`, config);
    return(ret);
}
