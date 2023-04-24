import axios from 'axios'
import { SetParamsToGetPost4 } from '../Headers/HeaderManager';

export async function GetPrivMsg(user : number)
{
    const config : any = SetParamsToGetPost4(user)
    let ret = await axios.get(`${process.env.REACT_APP_SERVER}:3630/main/resumeprivate`, config);
    return(ret);
}
