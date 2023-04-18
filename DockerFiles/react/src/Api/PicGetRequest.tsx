import react from 'react'
import axios from 'axios'
import { urls } from "../global"
import { SetParamsToGetPost5 } from '../Headers/HeaderManager';

export async function PicGetRequest(id : number)
{

    const config : any = SetParamsToGetPost5(id)
    let ret = await axios.get(`${urls.SERVER}/main/avatar`, config);
    return(ret);
}
