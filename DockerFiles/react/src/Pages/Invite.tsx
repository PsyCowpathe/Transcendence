import React, {useState} from "react";
import socketManager from "../MesSockets";



// -createinvite (nom de l’user a invite, nom du channel)
// -deleteinvite (nom de l’user a deinviter, nom du channel)



export function Invite({channel} : {channel : string | null})
{
    const socket = socketManager.getChatSocket();
    const [SendInvite, setSendInvite] = useState<string>("")
    const [DeleteInvite, setDeleteInvite] = useState<string>("")
    // console.log(channel)
    const inviteFriend = (e : any) => {
        e.preventDefault()
        console.log("invite friend")
        console.log(SendInvite)
        socket.emit("createinvitation", {name : SendInvite, channelname: channel})
        setSendInvite("" )
    }

    const deleteInvite = (e : any) => {
        e.preventDefault()

        console.log("delete invite")
        console.log(DeleteInvite)
        socket.emit("deleteinvitation", {name : DeleteInvite, channelname: channel})
        setDeleteInvite("")
    }



    return (
        <div>
            <form className="message-input" onSubmit={inviteFriend} >
                <input
                    type="text"
                    placeholder="Invite Request"
                    value={SendInvite}
                    onChange={(e) => setSendInvite(e.target.value)} />
                <button className="add-message-button" >Invite Friend</button>
            </form>
            <form className="message-input" onSubmit={deleteInvite} >
                <input
                    type="text"
                    placeholder="Invite Delete"
                    value={DeleteInvite}
                    onChange={(e) => setDeleteInvite(e.target.value)} />
                <button className="add-message-button" >Delete Invite</button>
            </form>
        </div>

    )

}