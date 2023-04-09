import { useContext, useEffect, useState } from "react"
import { SocketContext } from "../context/socket"
import { Socket } from "socket.io-client"

function Home() {
  const socket = useContext<Socket>(SocketContext) 
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [peers, setPeers] = useState<string[]>([])
  const [ messages, setMessages ] = useState<Map<string, string[]>>(new Map());
  const [ data, setData ] = useState('')
  const [ activePeer, setActivePeer ] = useState<string | null>(null)

  useEffect(() => {
    socket.connect();

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onRecivePeers(peers: string) {
      const peers_data = JSON.parse(peers)
      setPeers((peers_data as string[]).filter(s => s !== socket.id))
    }

    function onMessage(payload: { from: string, data: string }) {
      console.log('recived message', JSON.stringify(payload));
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('peers', onRecivePeers)
    socket.on('msg', onMessage)

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('peers', onRecivePeers)
      socket.off('msg', onMessage)
    };
  }, []);

  return (
    <div>
      {isConnected ? 'Connected!' : 'Not Connected!'} 
        {peers.map(peer => (
          <button 
            key={peer} 
            className={`${activePeer === peer ? 'text-red-500' :'text-green-500'} block`}
            onClick={() => setActivePeer(peer)}
          >{peer}</button>
        ))}
        {activePeer && (
          <>
            <input type="text" className="border-2 border-red-500" onChange={(e) => setData(e.target.value)}></input>
            <button 
              className="border-2 px-3" 
              onClick={() => {
                socket.emit('msg', { to: activePeer, data })
              }}
            >Send</button>
          </>
        )}
    </div>
  )
}

export default Home
