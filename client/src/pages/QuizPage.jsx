import Swal from "sweetalert2"
import "../App.css"
import axios from "axios"
import { useEffect, useState } from "react"
export default function QuizPage() {
    const [questions, setQuestions] = useState([])
    async function fetchQuestions() {
        try {
            const response = await axios({
                method: "POST",
                url: "http://localhost:3000/generate-quiz"

            })

            setQuestions(response.data)
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: error.response.message.data,
                title: "Error"
            })
        }
    }

    useEffect(() => {
        fetchQuestions()
    }, [])
}