import Swal from "sweetalert2";
import "../App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import socket from "../lib/socket";
import Card from "../components/Card";

export default function QuizPage() {
  const [questions, setQuestions] = useState(null);

  useEffect(() => {
    socket.on("sendquestions", (data) => {
      // console.log(data, "<<<< masuk")
      setQuestions(data);
    });
    return () => {
      socket.off("sendquestions");
    };
  }, []);

  // console.log(questions)

  return (
    <>
      <div className="w-screen min-h-screen bg-cover bg-center flex items-center justify-center relative lightBackground">
        <div
          id="overlay"
          className="absolute inset-0 bg-black bg-opacity-40 z-0 transition duration-500 lightOverlay"
        />
        {/* Snowfall container (will be filled by JS) */}
        <div id="snowfall-container" />
       
        {/* Opponent Score (top-left) */}
        <div className="absolute top-5 left-5 z-10">
          <div
            id="opponentScoreDiv"
            className="bg-white bg-opacity-90 px-4 py-2 rounded-full shadow-md font-semibold text-red-600 transition duration-500"
          >
            Opponent Score: <span id="opponentScore">0</span>
          </div>
        </div>
        {/* My Score (top-right) */}
        <div
          id="myScoreDiv"
          className="absolute top-5 right-5 z-10 bg-white bg-opacity-90 px-4 py-2 rounded-full shadow-md font-semibold text-green-700 transition duration-500"
        >
          My Score: <span id="score">0</span>
        </div>
        {/* Quiz Form */}
        {questions.map(el => {
            return <Card
            question={el.question}
            
            />
        })}
      </div>
    </>
  );
}
