import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { socket, SocketContext } from './context/socket'

import './index.css'
import { MessengerProvider } from './hooks/useMessenger'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SocketContext.Provider  value={socket}> 
      <MessengerProvider>
        <App />
      </MessengerProvider>
		</SocketContext.Provider>
  </React.StrictMode>,
)
