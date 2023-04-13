import io from 'socket.io-client';
import { urls } from './global';
import { VraimentIlSaoule } from './Headers/VraimentIlEstCasseCouille';
class SocketManager {
  private chatSocket: any;
  private FriendRequestSocket: any;
  private PongSocket: any;

  constructor() {
    this.chatSocket = null;
    this.FriendRequestSocket = null;
    this.PongSocket = null;
  }

  initializeChatSocket(token: string) {
    if (this.chatSocket === null) {
      this.chatSocket = io(`${urls.SOCKETCHAT}/`, {
        auth: {
          token: token,
          twoFAToken: localStorage.getItem('2FA')

        }
      });

    }

  }
  initializeFriendRequestSocket(token: string) {
    if (this.FriendRequestSocket === null) {
      this.FriendRequestSocket = io(`${urls.SOCKETFRIENDSHIP}`, {
        auth: {
          token: token,
          twoFAToken: localStorage.getItem('2FA')
        }
      });
    }
  }

  initializePongSocket(token: string) {
    if (this.PongSocket === null) {
      this.PongSocket = io(`${urls.SOCKETGAME}`, {
        auth: {
          token: token,
          twoFAToken: localStorage.getItem('2FA')
        }
      });
    }
  }


  getChatSocket(): any {
    return this.chatSocket;
  }

  getFriendRequestSocket(): any {
    return this.FriendRequestSocket;
  }
  getPongSocket(): any {
    return this.PongSocket;
  }
}

const socketManager = new SocketManager();
export default socketManager;