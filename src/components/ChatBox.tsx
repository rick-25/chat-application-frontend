import React, { useCallback, useMemo, useState } from "react"
import { useMessenger } from '../hooks/useMessenger'

const ChatBox: React.FC = () => {
    const { messages, peers, sendMessage, isConnected, user } = useMessenger();
    const [selectedChat, setSelectedChat] = useState<string | null>(null)
    const [chatText, setChatText] = useState('')

    const uniquePeers = useMemo<string[]>(() => {
        return [...new Set([...peers, ...(messages.map(msg => (msg.to !== user ? msg.to : msg.from)))])]
    }, [peers, messages])

    const getChat = useCallback((peer: string) => {
        return messages.filter(msg => (msg.from === peer || msg.to === peer))
    }, [messages])

    return (
        <div className="flex flex-row min-w-[700px] h-[400px] border shadow-xl">
            <div className="border w-fit">
                {uniquePeers.map(peer => (
                    <div 
                        key={peer}
                        className={`p-3 text-sm border hover:cursor-pointer flex flex-row justify-between items-center gap-5 ${peer === selectedChat ? 'bg-dark text-white': 'bg-inherit text-inherit'}`}
                        onClick={() => setSelectedChat(peer)}
                    >
                        <p className="text-sm">{peer}</p>
                        {peers.includes(peer) && (
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        )}
                    </div>
                ))}
            </div>
            <div className="flex-1 flex flex-col">
                <div className="flex flex-1 flex-col gap-2 p-3 overflow-x-scroll no-scrollbar">
                    {getChat(selectedChat || '').map(chat => (
                        <div key={JSON.stringify(chat)} className={`w-full flex flex-row ${chat.from === user ? 'justify-end' : 'justify-start'}`}>
                            <p className="w-fit bg-dark text-white p-1 px-2 rounded-md text-sm">{chat.data}</p>
                        </div>
                    ))}
                </div>
                <div className="border w-full h-10">
                    <form 
                        className="flex flex-row w-full h-full"
                        onSubmit={(e) => {
                            e.preventDefault()
                            if(selectedChat && chatText.length > 0) {
                                sendMessage(selectedChat, chatText)
                                setChatText('')
                            }
                        }}
                    >
                        <input 
                            placeholder="Enter text here.."
                            className="flex flex-1 h-full items-start focus:outline-none p-3"
                            autoFocus
                            value={chatText}
                            onChange={e => setChatText(e.target.value)}
                        />
                        <button 
                            type="submit" 
                            className="p-3 bg-dark text-white font-bold flex justify-center items-center"
                        >Send</button>
                    </form>
                </div>
            </div>
        </div>
    ) 
}

export default ChatBox