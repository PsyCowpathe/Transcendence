import axios from 'axios'
import { SetParamsToGetPost4 } from '../Headers/HeaderManager';

export async function GetUserInfo(UserName : number)
{
    const config : any = SetParamsToGetPost4(UserName)
    let ret = await axios.get(`${process.env.REACT_APP_SERVER}:3630/main/getuserinfos`, config);
    return(ret);
}
