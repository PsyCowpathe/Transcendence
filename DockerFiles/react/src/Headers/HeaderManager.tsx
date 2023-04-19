
export function SetParamsToGetPost()
{
    const token = localStorage.getItem('Token')
    const FA = localStorage.getItem('2FA')
        
    const config = 
    {
        headers: { Authorization: `${token}`,
        TwoFAToken: `${FA}`
     }
    };
    const config2 = 
    {
        responseType: 'blob', 
        headers: { Authorization: `${token}`,
        TwoFAToken: `${FA}` 
    }
    };
    
    
    const bodyParameters = 
    {
    key: token
    };
    
    return config

}
export function SetParamsToGetPost2()
{
    const token = localStorage.getItem('Token')
    const FA = localStorage.getItem('2FA')
        

    const config2 = 
    {
        responseType: 'blob', 
        headers: { Authorization: `${token}` ,
        TwoFAToken: `${FA}`}
    };
    
    
 
    
    return config2

}

export function SetParamsToGetPost3(param : string)
{
    const token = localStorage.getItem('Token')
    const FA = localStorage.getItem('2FA')
        

    const config2 = 
    {
        // responseType: 'blob', 

        headers: { Authorization: `${token}` ,
        TwoFAToken: `${FA}`},
        params : {
            channel:{ 
                channelName: param}
        },
    };
    
    return config2
}

export function SetParamsToGetPost4(param : number)
{
    const token = localStorage.getItem('Token')
    const FA = localStorage.getItem('2FA')
        
 
    const config2 = 
    {

        headers: { Authorization: `${token}` ,
        TwoFAToken: `${FA}`},
        params : {
            user:{ 
                id: param}
        },
    };  
    return config2

}


export function SetParamsToGetPost5(param : number)
{
    const token = localStorage.getItem('Token')
    const FA = localStorage.getItem('2FA')
        
 
    const config2 = 
    {
        responseType: 'blob', 

        headers: { Authorization: `${token}` ,
        TwoFAToken: `${FA}`},
        params : {
            user:{ 
                id: param}
        },
    };  
    return config2

}