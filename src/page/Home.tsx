import { useState } from "react"
import useMessenger from '../hooks/useMessenger'

function Home() {
  const { peers, messages, sendMessage, isConnected } = useMessenger()
  const [activePeer, setActivePeer] = useState('');
  const [data, setData] = useState('');

  console.log(messages);

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
            <input 
              type="text" 
              className="border-2 border-red-500" 
              onChange={(e) => setData(e.target.value)}
              value={data}
            ></input>
            <button 
              className="border-2 px-3" 
              onClick={() => {
                sendMessage(activePeer, data)
                setData('')
              }}
            >Send</button>
          </>
        )}
    </div>
  )
}

export default Home
