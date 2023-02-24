// import axios from 'axios';
// import { useState, useEffect } from 'react';
// let uid = "u-s4t2ud-21f144616dae6f0e27670562f16d1b3b8782bbad40c0d1ea5f0d1d54eae9d61f";
// let redirect = encodeURIComponent("http://localhost:3000");
// //let redirect = "https://reddit.com";
// let random = "dwdadfegthyhgfdASYJTUNBFSDRGW48754454"
// const URL: string = `https://api.intra.42.fr/oauth/authorize?client_id=${uid}&redirect_uri=${redirect}&response_type=code&scope=public&state=${random}'`
// let recup : any;

// export default function TryLogin() {

export default function test(){
    console.log("bite")
}
     
//     useEffect(() => {
//         const urlSearchParams = new URLSearchParams(window.location.search);
//         let token = urlSearchParams.get('code');
        
//         if (token) {
//             const pasresponse = axios.post("http://10.13.7.1:3630/auth/token", token)
//             .then(response => {
//               console.log(response.data);
//             })
//             .catch(error => {
//               console.log(error);
//             });
//         } else {
//           window.location.href = URL;
//         }
//       }, []);
      
//     return (
//         console.log("snfajkbnfd")
//     )
//     }
//     /*
//   const [myData, setMyData] = useState({});
    
//   const handleSendData = () => {
//     window.location.href=URL;
   
//     window.location.reload();

//   const handleLoad = () => {
//     const pasresponse = axios.post("http://10.13.7.1:3630/auth/token", myData)
//       .then(response => {
//         console.log(response.data);
//       })
//       .catch(error => {
//         console.log(error);
//       });
//   };
//   window.addEventListener('load', handleLoad);*/
  
  
//   // const pasresponse = axios.post("http://10.13.7.1:3630/user/create", {})
//   /* const response =  axios.get("http://10.13.7.1:3630/auth")
//   .then((json) =>
//   {
//       console.log("merci charles")
//       console.log(json.data);
//       //console.log(json.data);
//     })
//     .catch ((err) =>
//     {
//         console.log("ptn c est la faute d aurel")
//         alert(err.message)
//         return (err);
//     });*//*
// }
// return (
//     <div>
//         <button onClick={handleSendData}>biteeee</button>
//     </div>
// )
// }*/
// /*  const mafonc = () =>
//   {
//     recup = window.location.href;
//     console.log(recup)


//   }*//*
// export default async makePost() => {
//     const pasresponse = axios.post("http://10.13.7.1:3630/user/create", {id : 15 , name: "putain formate bien au moins"})
//     .then((json) =>
//     {
//       console.log("ca envois")
//     })
//     .catch((err) =>
//     {
//       console.log("ca envois pas")

//       alert(err.message)
//       return(err);
//     });*/
// /*    // console.log(response)
//     console.log("pas error")
//   } catch (error : any){
//     console.log("error")s
//     console.log(error.message);
//   }*/
  
// //}

// // export default {makeGet, makePost}
// //export default async function makePost() 

// //export default TryLogin;