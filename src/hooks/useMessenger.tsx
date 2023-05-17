import React, { 
    useCallback, 
    useEffect, 
    createContext, 
    useContext, 
    useMemo, 
    useState 
} from "react"
import { Socket, io } from "socket.io-client"
import useMessage from './useMessage'

const SOCKET_URL = import.meta.env.VITE_API_URL

export interface MessageI {
    from: string;
    to: string;
    data: string;
}

interface MessengerContextProps {
  peers: string[]
  isConnected: boolean
  messages: MessageI[]
  sendMessage: (to: string, data: string) => void 
  connectSocket: (token: string, email: string) => void
  user: string
}

const MessengerContext = createContext<MessengerContextProps>({
    peers: [],
    isConnected: false,
    messages: [],
    connectSocket: (token, email) => {},
    sendMessage: (to, data) => {},
    user: ''
})

interface MessengerProviderProps {
  children: React.ReactNode
}

function MessengerProvider({ children }: MessengerProviderProps): JSX.Element {

    const [email, setEmail] = useState('')
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false)
    const [peers, setPeers] = useState<string[]>([])

    const { messages, messageMutate } = useMessage()

    const sendMessage =  useCallback((to: string, data: string) => {
        socket?.emit('msg', { to, data })
        messageMutate([...(messages || []), { to, from: email, data }])
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
        () => ({ messages: messages || [], 
            sendMessage, 
            isConnected, 
            peers, 
            connectSocket,
            user: email
        }), 
        [messages, peers, isConnected, sendMessage, connectSocket, email]
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
            messageMutate([...(messages || []), payload])
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
