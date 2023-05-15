import React, { useContext, useEffect } from "react"
import useMessenger from "../hooks/useMessenger"

const Login: React.FC = () => {
    const { messages } = useMessenger()
    console.log(messages);
    return (
        <div>
            Login page
        </div>
    )
}

export default Login