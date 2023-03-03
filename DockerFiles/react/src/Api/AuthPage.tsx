import axios from 'axios';

import * as https from 'https';

export async function redirectTo42API()
{
    return axios.get("https://10.13.7.1:3630/auth/redirect", {httpsAgent: new https.Agent({rejectUnauthorized: false})
})
}
