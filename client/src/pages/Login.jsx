import { useState } from "react"
import "../App"
import Swal from "sweetalert2"
import {useNavigate} from "react-router"

export default function Login() {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const handleLogin = async (e) => {
        e.preventDefault()

        try {
            if(!username) throw {message: "Username is required"}
            localStorage.setItem("username", username)
            navigate("/waiting-room")
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: error.message,
                title: "Error"
            })
        }
    }
}