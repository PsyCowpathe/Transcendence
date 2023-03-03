import axios from 'axios';
//import { CookiesProvider } from "react-cookie";



export async  function  handleToken({token}  : any)
{
  console.log("je rentre dans le token")
  
  if (token.code != null)
  {
    console.log("je send un truc")
    
        axios.defaults.withCredentials = true
          /*await axios('http://10.13.7.1:3630/auth/register', {
          method: 'POST',
          withCredentials: true
          })*/
           await axios.post("https://10.13.7.1:3630/auth/register",  token)
          .then(response => {
            console.log("CA SEND")
          })
          .catch(error => {
            alert(error)
            console.log("REPONSE ERREUR : ");
            console.log(error);
          });
          console.log("wtf")
        }
    }
