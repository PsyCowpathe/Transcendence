import react from 'react'
import axios from 'axios'
import { urls } from "../global"
import { VraimentIlSaoule2 } from '../Headers/VraimentIlEstCasseCouille';
export async function PicGetRequest(id : number)
{
    interface id {
        id : number
    }
    const obj : id = {id : id}
    const config : any = VraimentIlSaoule2()
    let ret = await axios.get(`${urls.SERVER}/main/avatar/${obj}`, config);
    return(ret);
}
