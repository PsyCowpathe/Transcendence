import axios from 'axios';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
export async function redirectTo42API()
{

    return axios.get("https://10.13.7.1:3630/auth/redirect")

}