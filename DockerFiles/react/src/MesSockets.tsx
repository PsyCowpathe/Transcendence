import io from 'socket.io-client';
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
      this.chatSocket = io(`${process.env.REACT_APP_SERVER}:3632/`, {
        auth: {
          token: token,
          twoFAToken: localStorage.getItem('2FA')

        }
      });


  }
  initializeFriendRequestSocket(token: string) {
      this.FriendRequestSocket = io(`${process.env.REACT_APP_SERVER}:3631`, {
        auth: {
          token: token,
          twoFAToken: localStorage.getItem('2FA')
        }
      });
  }

  initializePongSocket(token: string) {
      this.PongSocket = io(`${process.env.REACT_APP_SERVER}:3633`, {
        auth: {
          token: token,
          twoFAToken: localStorage.getItem('2FA')
        }
      });
  }
  initializeStatusSocket(token: string) {
      this.StatusSocket = io(`${process.env.REACT_APP_SERVER}:3634`, { 
        auth: {
          token: token,
          twoFAToken: localStorage.getItem('2FA')
        }
      });
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
