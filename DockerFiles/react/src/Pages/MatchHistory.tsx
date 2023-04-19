import react from 'react';
import { useEffect } from 'react';
import { GetMatchHistory } from '../Api/GetMatchHistory';
import { useNavigate } from 'react-router-dom';

interface User {
    name: string;
    uid : number
  }
  
  interface Props {
    user: User;
  }
export function MatchHist({User} : {User : User})
{
    const navigate = useNavigate()
    const [History , setHistory] = react.useState<any>([])

    useEffect(() => {
        GetMatchHistory(User.uid)
        .then((res) => {
            setHistory(res.data)
        }
        )
        .catch ((err) => {
            if (err.response) {
                if (err.message !== "Request aborted") {
                  if (err.response.data.message === "Invalid user" || err.response.data.message === "Invalid Bearer token")// erreur de token ==> redirection vers la page de change login
                    navigate('/')
                  if (err.response.data.message === "User not registered")// ==> redirection vers la page de register
                    navigate('/Change')
                  if (err.response.data.message === "Invalid 2FA token") //erreur de 2FA ==> redirection vers la page de 2FA
                    navigate('/Send2FA')
              }
            }
        }
        )
    }, [])

return(
    <div>
        <h1>Match History</h1>
    </div>
)
}