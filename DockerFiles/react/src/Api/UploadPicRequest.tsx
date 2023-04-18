import axios from 'axios';
import { urls } from "../global";
import { SetParamsToGetPost } from '../Headers/HeaderManager';

export async function UploadPicRequest(file : any)
{
    let config = SetParamsToGetPost()
    console.log(`btaunez ${config.headers.Authorization}`)
    console.log(`ptn de sa mere : ${urls.SERVER}`)
    return await axios.post(`${urls.SERVER}/main/avatar`, file, config)
} 
