import ReactDOM from 'react-dom/client'
import App from './App'
import { socket, SocketContext } from './context/socket'

import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
    <SocketContext.Provider  value={socket}> 
      <App />
		</SocketContext.Provider>
  // </React.StrictMode>,
)
