import axios from 'axios';
import { urls } from "../global";
import { SetParamsToGetPost } from '../Headers/HeaderManager';


export async  function  SendTokenRequest(tokenForm  : any)
{
const config = SetParamsToGetPost()
  return await axios.post(`${urls.SERVER}/auth/register`,  tokenForm, config)
}
