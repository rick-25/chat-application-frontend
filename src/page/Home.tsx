import { useMessenger } from '../hooks/useMessenger'
import { Navigate } from "react-router-dom";
import ChatBox from '../components/ChatBox';

function Home() {
  const { isConnected } = useMessenger()

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      {!isConnected && (
        <Navigate to="/login" replace />
      )}
      {isConnected && <ChatBox />}
    </div>
  )
}

export default Home
