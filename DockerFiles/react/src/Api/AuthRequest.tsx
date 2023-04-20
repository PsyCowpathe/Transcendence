import { urls } from "../global";
import axios from 'axios';

import { SetParamsToGetPost } from '../Headers/HeaderManager';



export async function redirectTo42API()
{
     const config = SetParamsToGetPost()
     console.log("coucou je vais faire un get")
     let ret = await axios.get(`${urls.SERVER}/auth/redirect`,config)
     console.log("coucou j ai fait mon get")
    return ret
}  