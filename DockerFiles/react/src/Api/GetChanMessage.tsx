import axios from 'axios'
import { SetParamsToGetPost3 } from '../Headers/HeaderManager';


export async function GetChannelInfo(Channel : string)
{
    
    const config : any = SetParamsToGetPost3(Channel)
    let ret = await axios.get(`${process.env.REACT_APP_SERVER}:3630/main/resumechannel`, config);
    return(ret);
}
