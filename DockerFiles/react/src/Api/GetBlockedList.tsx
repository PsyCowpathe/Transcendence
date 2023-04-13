
import axios from 'axios'
import { urls } from "../global"
import { VraimentIlSaoule } from '../Headers/VraimentIlEstCasseCouille';

export async function GetBlockList()
{
    const config : any = VraimentIlSaoule()
    let ret = await axios.get(`${urls.SERVER}/main/getblocked`, config);
    return(ret);
}
