import Swal from "sweetalert2";
import "../App.css";
import axios from "axios";
import { useContext, useEffect, useState, useRef } from "react";
import { useContext, useEffect, useState } from "react";
import socket from "../lib/socket";
import Card from "../components/Card";
import { useTimer } from "use-timer";
import ThemeContext from "../contexts/theme";
import { Navigate } from "react-router";

export default function QuizPage() {
  const [questions, setQuestions] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [redirectToLeaderboard, setRedirectToLeaderboard] = useState(false);
  const context = useContext(ThemeContext);

  const correctSound = useRef(null);
  const wrongSound = useRef(null);
  const maxTime = 10;

  useEffect(() => {
    const savedQuizData = localStorage.getItem('quizData');
    if (savedQuizData) {
      const data = JSON.parse(savedQuizData);
      setQuestions(data.questions);
      setCurrentQuestionIndex(data.currentQuestionIndex || 0);
      setScore(data.score || 0);
      setOpponentScore(data.opponentScore || 0);
      setIsQuizFinished(data.isQuizFinished || false);
    }
  }, []);

  useEffect(() => {
    if (questions) {
      const dataToSave = {
        questions,
        currentQuestionIndex,
        score,
        opponentScore,
        isQuizFinished
      };
      localStorage.setItem('quizData', JSON.stringify(dataToSave));
    }
  }, [questions, currentQuestionIndex, score, opponentScore, isQuizFinished]);

  const { time, start, reset, pause } = useTimer({
    initialTime: maxTime,
    timerType: "DECREMENTAL",
    endTime: 0,
    onTimeOver: () => {
      handleNextQuestion();
    },
  });

  const timerProgressPercentage = (time / maxTime) * 100;

  useEffect(() => {
    const inGameSound = new Audio("/ingame.mp3");
    inGameSound.loop = true;
    inGameSound.volume = 0.5;

    correctSound.current = new Audio("/correct.mp3");
    wrongSound.current = new Audio("/wrong.mp3");

    inGameSound.play().catch((err) => {
      console.warn("Autoplay diblokir browser:", err);
    });

    socket.disconnect().connect();

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
      inGameSound.pause();
      inGameSound.currentTime = 0;
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
      setCurrentQuestionIndex((prev) => prev + 1);
      reset();
    } else {
      setIsQuizFinished(true);
      setRedirectToLeaderboard(true);
      reset();
      localStorage.removeItem('quizData');
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
      correctSound.current?.play();

      Swal.fire({
        title: "Correct!",
        text: "Good job!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      wrongSound.current?.play();
      Swal.fire({
        title: "Incorrect!",
        text: `The correct answer was: ${
          currentQuestion.choices[currentQuestion.correctAnswer]
        }`,
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
      });
    }

    handleNextQuestion();
  };

  if (!questions) {
    return (
      <div
        className={`w-screen min-h-screen bg-cover bg-center flex items-center justify-center relative ${context.theme}Background`}
      >
        <div className="text-2xl font-bold text-white">
          Loading questions...
        </div>
      </div>
    );
  }

  if (redirectToLeaderboard) {
    return <Navigate to="/leaderboard" replace />;
  }

  const currentQuestion = questions?.questions[currentQuestionIndex];

  return (
    <>
      <div
        className={`w-screen min-h-screen bg-cover bg-center flex items-center justify-center relative ${context.theme}Background`}
      >
        <div
          id="overlay"
          className={`absolute inset-0 bg-black bg-opacity-40 z-0 transition duration-500 ${context.theme}Overlay`}
        />
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
        <Card
          context={context}
          currentQuestion={currentQuestion}
          selectedAnswer={selectedAnswer}
          currentQuestionIndex={currentQuestionIndex}
          handleSubmit={handleSubmit}
          questions={questions}
          setSelectedAnswer={setSelectedAnswer}
        />

        {/* Timer Progress Bar di bawah halaman */}
        <div className="absolute bottom-0 left-0 right-0 h-3 z-20 bg-gray-200">
          <div 
            className="h-full bg-red-600 transition-all duration-1000 ease-linear"
            style={{ width: `${timerProgressPercentage}%` }}
          />
        </div>
      </div>
    </>
  );
}
