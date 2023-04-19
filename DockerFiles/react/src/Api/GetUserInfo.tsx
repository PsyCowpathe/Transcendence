import axios from 'axios'
import { urls } from "../global"
import { SetParamsToGetPost4 } from '../Headers/HeaderManager';
export async function GetUserInfo(UserName : number)
{
    const config : any = SetParamsToGetPost4(UserName)
    let ret = await axios.get(`${urls.SERVER}/main/getuserinfos`, config);
    return(ret);
}
