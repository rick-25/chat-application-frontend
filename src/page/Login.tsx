import React, { useContext, useEffect } from "react"
import { Navigate } from "react-router-dom"
import { useMessenger } from "../hooks/useMessenger"

const Login: React.FC = () => {
    const { connectSocket, isConnected } = useMessenger()
    return (
        <div>
            {isConnected && (
                <Navigate to={"/"} replace={true}/>
            )}
            <button onClick={() => {
                connectSocket()
            }}>Connect!</button>
        </div>
    )
}

export default Login