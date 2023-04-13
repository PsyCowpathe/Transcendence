import react from 'react';
import io from 'socket.io-client';
import { socketManager } from './Pages/HomePage';
  
import * as React from 'react';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';
import { TopBar } from './Pages/TopBar';

// export function TestButton() {
  
//   const Delete = () => {
//     const test = socketManager.initializeChatSocket(SetParamsToGetPost().headers.Authorization)
//     test.emit("chat message", "test")
//     test.on("chat message", (msg: string) => {
//         console.log("la rep :")
//         console.log(msg)
//         });
    
//     }
  
  

    export default function IconLabelButtons() {

        const test1 = () => {
            console.log("test")
        }
        const test2 = () => {
            console.log("test2")
        }
      return (
        <div>
        <TopBar/>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={test1} startIcon={<DeleteIcon />}>
            Delete
          </Button>
          <Button variant="contained" onClick={test2} endIcon={<SendIcon />}>
            Send
          </Button>
        </Stack>
        </div>
      );
    }
