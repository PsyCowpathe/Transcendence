import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./truc.css";
import {socketManager} from "../Pages/HomePage";
import { VraimentIlSaoule } from "../aurelcassecouilles/VraimentIlEstCasseCouille";
import { TopBar } from "../Pages/TopBar";

let test : boolean = false
let socket: any


interface ChanEmit{
    name: string;
    visibility: string;
    password: string | undefined;
}
interface Chati{
    id: number;
    name: string;
}

export function CreateChan()
{
    const [Chanlist, setChanlist] = useState<Chati[]>([]);
    const [Channame, setChanname] = useState<string>('');
    
    socket = socketManager.getChatSocket()

    console.log("je suis null1")

    if (socket == null)
    { 
        console.log("je suis null2")
        if ( test === false && VraimentIlSaoule().headers.Authorization !== null)
        {
            console.log("je suis null3")
            socket = socketManager.initializeChatSocket(VraimentIlSaoule().headers.Authorization)
            console.log(socket )  
            test = true
        }
    }

   
    const Channels = (e:any) => {
        e.preventDefault();
        console.log("sadas")
        setChanlist([...Chanlist, {id:Chanlist.length + 1  , name:Channame}  ]);
        socket.emit("createchannel", {name: Channame, visibility: "public", password: `bite ${Chanlist.length + 1}`})
        setChanname('')
    }
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = () => {
      setIsChecked(!isChecked);
    };

    
    
    return (
        <div className="chat-app" style={{ height: "100vh"}}>
              <div className="chat-app__sidebar">
                <div className="channel-list">
                  <h2>Channels</h2>
                  <ul>
                    {Chanlist.map((chanName) => (
                        <li className="active" key={chanName.id} >
                     {chanName.name} </li> 
                    ))}
                  </ul>
                  <form onSubmit={Channels} >
                    <input type="text" placeholder="New chan" value={Channame} onChange={(e) => setChanname(e.target.value)} />
                  <button className="add-channel-button" >Add Channel</button>
                  </form>
                  <div>
      <label>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        ! private ?
      </label>
      {!isChecked && (
        <form>
          <form onSubmit={Channels} >
                    <input type="text" placeholder="Mot de passe" value={Channame} onChange={(e) => setChanname(e.target.value)} />
                  <button className="add-channel-button" >Set mot de passe</button>
                  </form>
        </form>
      )}
    </div>

                </div>
              </div>
              <div className="chat-app__main">
                <div className="channel-header">
                  <h2>General</h2>
                  <button className="add-message-button">New Message</button>
                </div>
                <div className="message-list">
                  <div className="message-item sent">
                    <div className="message-sender">John</div>
                    <div className="message-text">Hello, how are you?</div>
                  </div>
                  <div className="message-item received">
                    <div className="message-sender">Sarah</div>
                    <div className="message-text">I'm fine, thanks. How about you?</div>
                  </div>
                </div>
                <div className="message-input">
                  <textarea placeholder="Type your message here"></textarea>
                  <button className="send-message-button">Send</button>
                </div>
              </div>
            </div>
          );
}
    