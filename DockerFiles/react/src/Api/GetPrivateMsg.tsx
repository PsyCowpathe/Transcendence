import react from 'react'
import axios from 'axios'
import { urls } from "../global"
import { SetParamsToGetPost4 } from '../Headers/HeaderManager';


export async function GetPrivMsg(user : number)
{
    const config : any = SetParamsToGetPost4(user)
    let ret = await axios.get(`${urls.SERVER}/main/resumeprivate`, config);
    return(ret);
}
