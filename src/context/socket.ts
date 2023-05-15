import React, { useContext } from 'react';
import io, { Socket } from "socket.io-client"; 

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8001'

export const socket: Socket = io(SOCKET_URL, { 
    autoConnect: false, 
    transports: ["websocket", "polling"] 
});

export const SocketContext = React.createContext(socket);

export const useSocket = () => {
    const socket = useContext<Socket>(SocketContext)

    return {
        socket,
        connected: socket.connected,
    }
}