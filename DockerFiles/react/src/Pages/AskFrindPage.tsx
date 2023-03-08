import React, { useState, useEffect } from "react";
import { VraimentIlSaoule } from '../aurelcassecouilles/VraimentIlEstCasseCouille'
import io from "socket.io-client";
import '../css/Buttons.css'
import Button from "../style/Button";
import SocketManager from "../MesSockets";
// let socket : any
let config : any
let test : boolean = false
let socket: any
interface demande {
    username: string;
  //  message: string;
  }

export function AskFriend()
{


  if (test === false)
  {
     //config = VraimentIlSaoule().headers.Authorization
    //  socket = io("http://10.14.2.7:3631/",  {
    //   auth:
    //   {
    //     token : config
    //   },

      // reconnection: true,
  //  }); // Connecter à l'instance Socket.IO
    const socketManager = new SocketManager();
    socket = socketManager.getSocket2(); 
    test = true    
  }
  socket.on("reciepe", (demande: demande) => {
    console.log(demande)
     });
   
    const Ask = async() =>
    {
        await socket.emit("newlink", "bite");
    
    }


    return(
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <Button onClick={Ask} >demande</Button>
      </div>
    );
    
}
