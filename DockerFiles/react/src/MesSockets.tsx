import io from "socket.io-client"
import { VraimentIlSaoule } from "./aurelcassecouilles/VraimentIlEstCasseCouille";
const config = VraimentIlSaoule().headers.Authorization

class SocketManager {
    private socket1: any;
    private socket2: any;
    
    constructor() {
      this.socket1 = io('http://10.14.2.7:3631/',
          {
            auth:
          {
            token : config
          }
        })
     this.socket2 = io('http://10.14.2.7:3631/',
     {
        auth:
      {
        token : VraimentIlSaoule().headers.Authorization

      }
    });
    }
  
    getSocket1(): any {
      return this.socket1;
    }
  
    getSocket2():any {
      return this.socket2;
    }
  
    // autres méthodes pour manipuler les sockets
  }
  
  export default SocketManager;