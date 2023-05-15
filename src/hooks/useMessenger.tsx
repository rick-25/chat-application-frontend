import { useCallback, useEffect, useState } from 'react';
import { useSocket } from '../context/socket'

export const useMessenger = () => {
    const { socket } = useSocket()
    const [isConnected, setIsConnected] = useState(socket.connected)
    const [peers, setPeers] = useState<string[]>([])
    const [messages, setMessages] = useState<Map<string, string[]>>(new Map());

    const sendMessage =  useCallback((to: string, data: string) => {
        socket.emit('msg', { to, data })
    }, [])

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
    }, []);

    return {
        peers,
        isConnected,
        messages,
        sendMessage
    }
}

export default useMessenger