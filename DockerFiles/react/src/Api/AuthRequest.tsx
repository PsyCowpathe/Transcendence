import { urls } from "../global";
import axios from 'axios';

import { VraimentIlSaoule } from '../aurelcassecouilles/VraimentIlEstCasseCouille';



export async function redirectTo42API()
{
    const config = VraimentIlSaoule()
    return await axios.get(`${urls.SERVER}/auth/redirect`,config)
}  