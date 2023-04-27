import axios from 'axios';

import { SetParamsToGetPost } from '../Headers/HeaderManager';

export async function redirectTo42API()
{
     const config = SetParamsToGetPost()
     let ret = await axios.get(`${process.env.REACT_APP_SERVER}:3630/auth/redirect`,config)
    return ret
}  
