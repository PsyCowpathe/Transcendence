import axios from 'axios';

import { SetParamsToGetPost } from '../Headers/HeaderManager';

export async function redirectTo42API()
{
     const config = SetParamsToGetPost()
     console.log("coucou je vais faire un get")
	console.log(process.env.REACT_APP_SERVER + ":3630")
     let ret = await axios.get(`${process.env.REACT_APP_SERVER}:3630/auth/redirect`,config)
     console.log("coucou j ai fait mon get")
    return ret
}  
