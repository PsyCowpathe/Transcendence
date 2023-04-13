import react from 'react'
import axios from 'axios'
import { urls } from "../global"
import { SetParamsToGetPost4 } from '../Headers/VraimentIlEstCasseCouille';
export async function PicGetRequest(id : number)
{

    const config : any = SetParamsToGetPost4(id)
    let ret = await axios.get(`${urls.SERVER}/main/avatar`, config);
    return(ret);
}
