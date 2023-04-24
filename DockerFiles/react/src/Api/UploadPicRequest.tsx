import axios from 'axios';
import { SetParamsToGetPost } from '../Headers/HeaderManager';

export async function UploadPicRequest(file : any)
{
    let config = SetParamsToGetPost()
    console.log(`btaunez ${config.headers.Authorization}`)
    console.log(`ptn de sa mere : ${process.env.SERVER}:3630`)
    return await axios.post(`${process.env.SERVER}:3630/main/avatar`, file, config)
} 
