import React, { 
    useCallback, 
    useEffect, 
    createContext, 
    useContext, 
    useMemo, 
    useState 
} from "react"
import { Socket, io } from "socket.io-client"

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8001'

interface MessageI {
    from: string;
    to: string;
    data: string;
}

interface MessengerContextProps {
  peers: string[]
  isConnected: boolean
  messages: Map<string, MessageI[]>
  sendMessage: (to: string, data: string) => void 
  connectSocket: (token: string, email: string) => void
}

const MessengerContext = createContext<MessengerContextProps>({
    peers: [],
    isConnected: false,
    messages: new Map(),
    connectSocket: (token, email) => {},
    sendMessage: (to, data) => {},
})

interface MessengerProviderProps {
  children: React.ReactNode
}

function MessengerProvider({ children }: MessengerProviderProps): JSX.Element {

    const [email, setEmail] = useState('')
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false)
    const [peers, setPeers] = useState<string[]>([])
    const [messages, setMessages] = useState<Map<string, MessageI[]>>(new Map());

    const sendMessage =  useCallback((to: string, data: string) => {
        socket?.emit('msg', { to, data })
        setMessages(msg => {
            return new Map(msg.set(
                to, 
                [...(msg.get(to) || []), { to, from: email, data}]
            ))
        })
    }, [socket])

    const connectSocket = useCallback((token: string, email: string) => {
        const socket = io(SOCKET_URL, { 
            transports: ["websocket", "polling"],
            auth: { token }
        });
        setSocket(socket)
        setEmail(email)
    }, [])

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
            setPeers((peers_data as string[]).filter(s => s !== email))
        }

        function onMessage(payload: { to: string, from: string, data: string }) {
            setMessages(msg => {
                return new Map(msg.set(
                    payload.from, 
                    [...(msg.get(payload.from) || []), payload]
                ))
            })
        }

        socket?.on('connect', onConnect);
        socket?.on('disconnect', onDisconnect);
        socket?.on('peers', onRecivePeers)
        socket?.on('msg', onMessage)

        return () => {
            socket?.off('connect', onConnect);
            socket?.off('disconnect', onDisconnect);
            socket?.off('peers', onRecivePeers)
            socket?.off('msg', onMessage)
        };
    }, [socket]);

  return <MessengerContext.Provider value={value}>{children}</MessengerContext.Provider>
}

const MessengerConsumer = MessengerContext.Consumer

const useMessenger = () => useContext(MessengerContext)

export { MessengerProvider, MessengerConsumer, useMessenger }
