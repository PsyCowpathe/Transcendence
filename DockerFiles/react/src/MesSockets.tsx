import io from 'socket.io-client';
import { urls } from './global';
import { SetParamsToGetPost } from './Headers/HeaderManager';
class SocketManager {
  private chatSocket: any;
  private FriendRequestSocket: any;
  private PongSocket: any;
  private StatusSocket: any;

  constructor() {
    this.chatSocket = null;
    this.FriendRequestSocket = null;
    this.PongSocket = null;
    this.StatusSocket = null;
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
  initializeStatusSocket(token: string) {
    if (this.StatusSocket === null) {
      this.StatusSocket = io(`${urls.SOCKETSTATUS}`, { 
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
  getStatusSocket(): any {
    return this.StatusSocket;
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