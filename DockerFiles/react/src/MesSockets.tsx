import io from 'socket.io-client';

class SocketManager {
  private chatSocket: any;
  private FriendRequestSocket: any;

  constructor() {
    this.chatSocket = null;
    this.FriendRequestSocket = null;
  }

  initializeChatSocket(token: string) {
    if (this.chatSocket === null) {
      this.chatSocket = io('http://10.14.2.7:3631/', {
        auth: {
          token: token
        }
      });
    }
  }
  initializeFriendRequestSocket(token: string) {
    if (this.FriendRequestSocket === null) {
      this.FriendRequestSocket = io('http://10.14.2.7:3631/', {
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