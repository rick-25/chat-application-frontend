import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { socket, SocketContext } from './context/socket'
import { createBrowserRouter } from 'react-router-dom'
import Home from './page/Home'

import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SocketContext.Provider  value={socket}> 
      <App />
		</SocketContext.Provider>
  </React.StrictMode>,
)
