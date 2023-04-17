import { urls } from "../global";
import axios from 'axios';

import { SetParamsToGetPost } from '../Headers/HeaderManager';



export async function redirectTo42API()
{
    const config = SetParamsToGetPost()
    return await axios.get(`${urls.SERVER}/auth/redirect`,config)
}  