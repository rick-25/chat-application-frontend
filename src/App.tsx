import { useContext, useEffect, useState } from "react"
import { SocketContext } from "./context/socket"
import { Socket } from "socket.io-client"

function App() {
  const socket = useContext<Socket>(SocketContext) 
  const [isConnected, setIsConnected] = useState(socket.connected)

  useEffect(() => {
    socket.connect();
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return (
    <div>
      {isConnected ? 'Connected!' : 'Not Connected!'} 
    </div>
  )
}

export default App
