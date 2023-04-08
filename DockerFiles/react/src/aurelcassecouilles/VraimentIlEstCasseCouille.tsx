
export function VraimentIlSaoule()
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
export function VraimentIlSaoule2()
{
    const token = localStorage.getItem('Token')
    const FA = localStorage.getItem('2FA')
        
    const config = 
    {
        headers: { Authorization: `${token}`,
        TwoFAToken: `${FA}` }
    };
    const config2 = 
    {
        responseType: 'blob', 
        headers: { Authorization: `${token}` ,
        TwoFAToken: `${FA}`}
    };
    
    
    const bodyParameters = 
    {
    key: token
    };
    
    return config2

}