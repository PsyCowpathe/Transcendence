import React, {useState} from "react";
import socketManager from "../MesSockets";

export function Invite({channel} : {channel : string | null})
{
    const socket = socketManager.getChatSocket();
    const [SendInvite, setSendInvite] = useState<string>("")
    const [DeleteInvite, setDeleteInvite] = useState<string>("")
    const inviteFriend = (e : any) => {
        e.preventDefault()
        socket.emit("createinvitation", {name : SendInvite, channelname: channel})
        setSendInvite("" )
    }

    const deleteInvite = (e : any) => {
        e.preventDefault()

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