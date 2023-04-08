import axios from 'axios';
import { urls } from "../global";
import { VraimentIlSaoule } from '../aurelcassecouilles/VraimentIlEstCasseCouille';


export async  function  SendTokenRequest(tokenForm  : any)
{
const config = VraimentIlSaoule()
  return await axios.post(`${urls.SERVER}/auth/register`,  tokenForm, config)
}
