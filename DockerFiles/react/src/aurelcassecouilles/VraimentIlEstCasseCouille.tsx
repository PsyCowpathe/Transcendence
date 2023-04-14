
export function VraimentIlSaoule()
{
    const token = localStorage.getItem('Token')
        
    const config = 
    {
        headers: { Authorization: `${token}` }
    };
    const config2 = 
    {
        responseType: 'blob', 
        headers: { Authorization: `${token}` }
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
        
    const config = 
    {
        headers: { Authorization: `${token}` }
    };
    const config2 = 
    {
        responseType: 'blob', 
        headers: { Authorization: `${token}` }
    };
    
    
    const bodyParameters = 
    {
    key: token
    };
    
    return config2

}