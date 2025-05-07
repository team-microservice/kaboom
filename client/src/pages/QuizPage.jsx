import Swal from "sweetalert2";
import "../App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import socket from "../lib/socket";
import Card from "../components/Card";
import { useTimer } from "use-timer";


export default function QuizPage() {
  const [questions, setQuestions] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  const { time, start, reset, pause } = useTimer({
    initialTime: 10,
    timerType: 'DECREMENTAL',
    endTime: 0,
    onTimeOver: () => {
      handleNextQuestion();
    },
  });

  useEffect(() => {
    socket.on("sendquestions", (data) => {
      setQuestions(data);
      setCurrentQuestionIndex(0);
      setScore(0);
      setOpponentScore(0);
      setIsQuizFinished(false);
      reset();
      start();
    });

    socket.on("viewresult", (scoreData) => {
      if (scoreData.username !== socket.auth.username) {
        setOpponentScore(scoreData.score);
      }
    });

    return () => {
      socket.off("sendquestions");
      socket.off("viewresult");
      pause();
    };
  }, []);

  useEffect(() => {
    if (questions && !isQuizFinished) {
      reset();
      start();
    }
  }, [currentQuestionIndex]);

  const handleNextQuestion = () => {    
    if (questions && currentQuestionIndex < questions.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      reset()
    } else {
      setIsQuizFinished(true);
      reset()
      
      Swal.fire({
        title: 'Quiz Finished!',
        text: `Your final score: ${score}`,
        icon: 'success',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedAnswer) return;
    
    const currentQuestion = questions.questions[currentQuestionIndex];
    if (parseInt(selectedAnswer) === currentQuestion.correctAnswer) {
      const newScore = score + 10;
      setScore(newScore);
      
      socket.emit("result", newScore);
      
      Swal.fire({
        title: 'Correct!',
        text: 'Good job!',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } else {
      Swal.fire({
        title: 'Incorrect!',
        text: `The correct answer was: ${currentQuestion.choices[currentQuestion.correctAnswer]}`,
        icon: 'error',
        timer: 1500,
        showConfirmButton: false
      });
    }
    
    handleNextQuestion();
  };

  if (!questions) {
    return (
      <div className="w-screen min-h-screen bg-cover bg-center flex items-center justify-center relative lightBackground">
        <div className="text-2xl font-bold text-white">Loading questions...</div>
      </div>
    );
  }

  const currentQuestion = questions?.questions[currentQuestionIndex];

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
            Opponent Score: <span id="viewresult">{opponentScore}</span>
          </div>
        </div>
        {/* My Score (top-right) */}
        <div
          id="myScoreDiv"
          className="absolute top-5 right-5 z-10 bg-white bg-opacity-90 px-4 py-2 rounded-full shadow-md font-semibold text-green-700 transition duration-500"
        >
          My Score: <span id="score">{score}</span>
        </div>
        {/* Quiz Form */}


        <div
          id="card"
          className="bg-gray-900 border-[5px] border-orange-500 rounded-2xl p-10 w-[600px] text-center relative z-10 shadow-xl transition duration-500 text-white"
        >
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-2 rounded-full font-bold shadow-md text-sm">
            QUIZ TIME
          </div>
          <h2 id="title" className="text-2xl font-bold mb-6">
            {currentQuestion?.question}
          </h2>
          <form id="quizForm" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-6 text-left">
              {currentQuestion?.choices.map((option, index) => (
                <label
                  key={index}
                  id={`answer${index}`}
                  className={`flex items-center bg-gray-700 px-4 py-3 rounded-full cursor-pointer hover:bg-gray-600 transition text-white ${
                    parseInt(selectedAnswer) === index ? "border-2 border-green-500" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={index}
                    checked={parseInt(selectedAnswer) === index}
                    onChange={() => setSelectedAnswer(index.toString())}
                    className="mr-2"
                  />
                  {String.fromCharCode(65 + index)}. {option}
                </label>
              ))}
            </div>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-10 rounded-full shadow-md transition duration-300"
              disabled={!selectedAnswer}
            >
              SUBMIT
            </button>
          </form>
          <div className="mt-4 text-sm">
            Question {currentQuestionIndex + 1} of {questions.questions.length}
          </div>
        </div>

      </div>
    </>
  );
}
