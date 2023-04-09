import { useContext, useEffect, useState } from "react"
import { SocketContext } from "../context/socket"
import { Socket } from "socket.io-client"

function Home() {
  const socket = useContext<Socket>(SocketContext) 
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [ messages, setMessages ] = useState<Map<string, string[]>>(new Map());
  const [peers, setPeers] = useState<string[]>([])

  useEffect(() => {
    socket.connect();

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onRecivePeers(peers: string) {
      setPeers(JSON.parse(peers))
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('peers', onRecivePeers)

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('peers', onRecivePeers)
    };
  }, []);

  return (
    <div>
      {isConnected ? 'Connected!' : 'Not Connected!'} 
      {peers.map(peer => (
        <p>{peer}</p>
      ))}
    </div>
  )
}

export default Home
