import axios from 'axios';
import { SetParamsToGetPost } from '../Headers/HeaderManager';

export async function UploadPicRequest(file : any)
{
    let config = SetParamsToGetPost()
    return await axios.post(`${process.env.REACT_APP_SERVER}:3630/main/avatar`, file, config)
} 
