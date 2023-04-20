import React from 'react';
import { useEffect, useState } from 'react';
import { GetMatchHistory } from '../Api/GetMatchHistory';
import { useNavigate } from 'react-router-dom';

interface User {
    name: string;
    uid : number
  }
  
interface Match {
  scoreP1 : number;
  scoreP2 : number;
  nameP1  : string;
  nameP2  : string;
}

  interface Props {
    user: User;
  }
export function MatchHist({User} : {User : User})
{
    const navigate = useNavigate()
    const [History , setHistory] = useState<Match[]>([])

    useEffect(() => {
        GetMatchHistory(User.uid)
        .then((res) => {
          setHistory(res.data.map((match : any) => {
            return ({
              scoreP1 : match.scoreP1,
              scoreP2 : match.scoreP2,
              nameP1  : match.nameP1,
              nameP2  : match.nameP2
            })
          })
          )
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
        <div>
            {History.map((match) => {
                return (
                    <div>
                        <p>{match.nameP1} {match.scoreP1} - {match.scoreP2} {match.nameP2}</p>
                    </div>)
            })}
        </div>
    </div>

)
}