// import io from "socket.io-client"
 import { VraimentIlSaoule } from "./aurelcassecouilles/VraimentIlEstCasseCouille";
// //const config = VraimentIlSaoule().headers.Authorization

// class SocketManager {
//     public socket1: any;
//     // private socket2: any;
    
//     constructor() {
//       this.socket1 = io('http://10.14.2.7:3631/',
//           {
//             auth:
//           {
//             token : VraimentIlSaoule().headers.Authorization
//           }
//         })
//     // this.socket2 = io('http://10.14.2.7:3631/',
//     //  {
//     //     auth:
//     //   {
//     //     token : VraimentIlSaoule().headers.Authorization

//     //   }
//     // });
//     }
  
//     getSocket1(): any {
//       return this.socket1;
//     }
  
//     // getSocket2():any {
//     //   return this.socket2;
//     // }
  
//     // autres méthodes pour manipuler les sockets
//   }
  
//   export default SocketManager;


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