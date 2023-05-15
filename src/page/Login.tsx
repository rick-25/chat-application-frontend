import React, { useContext, useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { useMessenger } from "../hooks/useMessenger"

const Login: React.FC = () => {
    const { connectSocket, isConnected } = useMessenger()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const getToken = async (email: string, password: string) => {
        const res = await fetch('http://localhost:8001/auth/signup', {
            method: 'post',
            body: JSON.stringify({ email, password }),
            headers: {
                "Content-Type": "application/json",
            }
       })
       const token = (await res.json()).token

       localStorage.setItem('token', token)

       return token
    }

    return (
        <div className="w-full h-screen flex justify-center items-center">
            {isConnected && (
                <Navigate to={"/"} replace={true}/>
            )}
            <form
                onSubmit={async (e) => {
                    e.preventDefault()
                    const token = await getToken(email, password)
                }}
                className="flex flex-col gap-5 p-5 w-[500px] border border-black shadow-xl rounded-md"
            >
                <input 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    type="email" 
                    placeholder="email" 
                    className="border-2 border-black p-1 px-2 text-gray-600 rounded-md"
                />
                <input 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    type="password" 
                    placeholder="password" 
                    className="border-2 border-black p-1 px-2 text-gray-600 rounded-md"
                />
                <button type="submit" className="bg-black text-white rounded-md p-1">Connect!</button>
            </form>
        </div>
    )
}

export default Login