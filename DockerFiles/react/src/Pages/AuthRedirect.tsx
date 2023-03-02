import { useNavigate, useSearchParams } from 'react-router-dom'
//import { checkIfUserAlreadySignedUp } from '../api/Auth'
import axios from 'axios';
import { useEffect} from 'react'


export  function AuthRedirectionPage ()
{
//	let navigate = useNavigate()
	const [queryParameters] = useSearchParams()
	const codeReturnBy42API = queryParameters.get("code")
	const stateReturnBy42API = queryParameters.get("state")
    const token = [{state : stateReturnBy42API ,code: codeReturnBy42API}]
    console.log("bhfbdjhskbds jh")
	if (codeReturnBy42API === null)
	{
		window.location.assign("/") //ou page d erreur a voir
	}
    else 
    {
         axios.post("http://10.13.7.1:3630/auth/register", token)
    	.then(response => {
		  //window.location.assign('/');
		  //console.log("REPONSE VALIDE")
		  //setCookie('token', response.data, {path: '/'})
		  console.log("MAAAAA BIIIIITTTTEEEEE")
		  // console.log(cookies)
		  
		  console.log(response)
		 // return
		})
		.catch(error => {
		  alert(error)
		  console.log("REPONSE ERREUR : ");
		  console.log(error.response.data.message);
		 // return
		});

    }


	useEffect(() => {
      //  console.log("bite");

		
	}, [])

	return (
		<div className="center">

			<h1>chargement fdp</h1> 

		</div>
	)
}
