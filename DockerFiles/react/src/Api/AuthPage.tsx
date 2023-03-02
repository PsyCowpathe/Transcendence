import axios from 'axios';


export async function redirectTo42API()
{
    return axios.get("http://10.13.7.1:3630/auth/redirect")

}