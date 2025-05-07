import { useNavigate } from "react-router"
import "../App.css" 
import { useEffect, useState } from "react"
import socket from "../lib/socket"
export default function LoadingPage() {
    const navigate = useNavigate
    const [players, setPlayers] = useState([])

    useEffect(() => {
        socket.auth = {
            username: localStorage.getItem("username")
        }

        socket.disconnect().connect()
        setPlayers([...players, socket.auth.username])
        socket.emit("addClient", socket.auth.username)
    }, [])

    if(players.length > 1) {
        navigate("/quiz")
    }

    return
}