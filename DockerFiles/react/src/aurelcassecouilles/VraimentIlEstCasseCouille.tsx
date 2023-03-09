
export function VraimentIlSaoule()
{
    const token = localStorage.getItem('Token')
        
    const config = 
    {
        headers: { Authorization: `${token}` }
    };
    
    
    const bodyParameters = 
    {
    key: token
    };
    
    return config

}