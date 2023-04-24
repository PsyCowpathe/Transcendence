import axios from 'axios'
import { SetParamsToGetPost5 } from '../Headers/HeaderManager';

export async function PicGetRequest(id : number)
{

    const config : any = SetParamsToGetPost5(id)
    let ret = await axios.get(`${process.env.REACT_APP_SERVER}:3630/main/avatar`, config);
    return(ret);
}
