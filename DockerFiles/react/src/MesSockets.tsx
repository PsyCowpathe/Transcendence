import io from 'socket.io-client';
import { urls } from './global';
class SocketManager {
  private chatSocket: any;
  private FriendRequestSocket: any;

  constructor() {
    this.chatSocket = null;
    this.FriendRequestSocket = null;
  }

  initializeChatSocket(token: string) {
    if (this.chatSocket === null) {
      this.chatSocket = io(`${urls.SOCKETCHAT}/`, {
        auth: {
          token: token
        }
      });

    }
    this.chatSocket.emit("newlink")

  }
  initializeFriendRequestSocket(token: string) {
    if (this.FriendRequestSocket === null) {
      this.FriendRequestSocket = io(`${urls.SOCKETFRIENDSHIP}`, {
        auth: {
          token: token
        }
      });
    }
    this.FriendRequestSocket.emit("newlink")
  }



  getChatSocket(): any {
    return this.chatSocket;
  }

  getFriendRequestSocket(): any {
    return this.FriendRequestSocket;
  }
}

const socketManager = new SocketManager();
export default socketManager;