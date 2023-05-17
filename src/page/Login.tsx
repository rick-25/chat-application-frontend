import React, { useContext, useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { useMessenger } from "../hooks/useMessenger"

const Login: React.FC = () => {
    const { connectSocket, isConnected } = useMessenger()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        localStorage.removeItem('token')
    }, [])

    const getToken = async (email: string, password: string) => {
        const URL = import.meta.env.VITE_API_URL;
        const res = await fetch(`${URL}/auth/signup`, {
            method: 'post',
            body: JSON.stringify({ email, password }),
            headers: {
                "Content-Type": "application/json",
            }
        })

        if(res.status === 401) {
            alert('Invalid credentials')
            return null
        }

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
                    if(token) connectSocket(token, email)
                }}
                className="flex flex-col gap-5 p-5 w-[500px] border border-dark shadow-xl rounded-md"
            >
                <input 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    type="email" 
                    placeholder="email" 
                    className="border-2 border-dark p-1 px-2 text-gray-600 rounded-md"
                />
                <input 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    type="password" 
                    placeholder="password" 
                    className="border-2 border-dark p-1 px-2 text-gray-600 rounded-md"
                />
                <button type="submit" className="bg-dark text-white rounded-md p-1">Signup / Login</button>
            </form>
        </div>
    )
}

export default Login