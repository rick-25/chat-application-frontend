import React, { 
    useCallback, 
    useEffect, 
    createContext, 
    useContext, 
    useMemo, 
    useState 
} from "react"
import { useSocket } from '../context/socket'



interface MessengerContextProps {
  peers: string[]
  isConnected: boolean
  messages: Map<string, string[]>
  sendMessage: (to: string, data: string) => void 
  connectSocket: () => void
}

const MessengerContext = createContext<MessengerContextProps>({
    peers: [],
    isConnected: false,
    messages: new Map(),
    connectSocket: () => {},
    sendMessage: (to, data) => {},
})

interface MessengerProviderProps {
  children: React.ReactNode
}

function MessengerProvider({ children }: MessengerProviderProps): JSX.Element {
    const { socket } = useSocket()
    const [isConnected, setIsConnected] = useState(socket.connected)
    const [peers, setPeers] = useState<string[]>([])
    const [messages, setMessages] = useState<Map<string, string[]>>(new Map());

    const sendMessage =  useCallback((to: string, data: string) => {
        socket.emit('msg', { to, data })
    }, [socket])

    const connectSocket = useCallback(() => {
        socket.connect()
    }, [socket])

    const value = useMemo(
        () => ({ messages, sendMessage, isConnected, peers, connectSocket }), 
        [messages, peers, isConnected, sendMessage, connectSocket]
    )

    useEffect(() => {
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
            console.log('inside message handler!!');
            setMessages(msg => {
                return new Map(msg.set(
                    payload.from, 
                    [...(msg.get(payload.from) || []), payload.data]
                ))
            })
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
    }, [socket]);

  return <MessengerContext.Provider value={value}>{children}</MessengerContext.Provider>
}

const MessengerConsumer = MessengerContext.Consumer

const useMessenger = () => useContext(MessengerContext)

export { MessengerProvider, MessengerConsumer, useMessenger }