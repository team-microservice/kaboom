import { Navigate, useNavigate } from "react-router";
import "../App.css";
import { useContext, useEffect, useState } from "react";
import socket from "../lib/socket";
import Swal from "sweetalert2";
import ThemeContext from "../contexts/theme";
export default function LoadingPage() {
  const navigate = useNavigate;
  const [players, setPlayers] = useState(null);
  const context = useContext(ThemeContext)

  useEffect(() => {
    socket.auth = {
      id: socket.id,
      username: localStorage.getItem("username"),
    };

    socket.disconnect().connect();
    // setPlayers([...players, socket.auth.username])

    // socket.emit("addClient", socket.auth.username)
    socket.emit("addClient", socket.auth);

    socket.on("updatechat", (message) => {
      console.log(message);
    });

    socket.on("users/info", (user) => {
      setPlayers(user);
    });
    // console.log(user, "<<< user")
    return () => {
      socket.off("users/info");
      socket.off("updatechat");
    };
  }, []);

  if (players === null) {
    return (
      <div className={`w-screen min-h-screen bg-cover bg-center flex items-center justify-center relative ${context.theme}Background`}>
        <span className="loading loading-dots loading-xl"></span>;
      </div>
    );
  }

  if (players.length > 1) {
    let timerInterval;
    Swal.fire({
      title: "Your opponent is ready!",
      html: "Game will start in <b></b> seconds.",
      timer: 5000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const timer = Swal.getPopup().querySelector("b");
        timerInterval = setInterval(() => {
          timer.textContent = `${Math.round(Swal.getTimerLeft() / 1000)}`;
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log("I was closed by the timer");
      }
    });

    return <Navigate to="/quiz" />;
  }

  return (
    <>
      <div className={`w-screen min-h-screen bg-cover bg-center flex items-center justify-center relative ${context.theme}Background`}>
        <div
          id="overlay"
          className={`absolute inset-0 ${context.theme}Overlay z-0 transition duration-500`}
        />
        {/* Snowfall container (will be filled by JS) */}
        <div id="snowfall-container" />
        {/* Result Container */}
        <div
          id="card"
          className={`border-[5px] rounded-2xl p-10 w-[600px] text-center relative z-10 shadow-xl transition duration-500 text-white ${context.theme}Card"`}
        >
          <div
            id="resultBadge"
            className="absolute -top-6 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-2 rounded-full font-bold shadow-md text-sm"
          >
            PREPARING
          </div>
          <h1
            id="resultHeader"
            className="text-4xl font-bold text-orange-500 mb-4"
          >
            Waiting for other players...
          </h1>
          <div
            id="rulesSection"
            className="bg-yellow-50 rounded-lg p-4 mb-6 text-black"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">Rules</h3>
            <ul className="text-left list-disc pl-8 space-y-2">
              <li>Each question has 10 seconds time.</li>
              <li>Click on the answer. Choices are disabled after one click</li>
              <li>Four Questions</li>
            </ul>
          </div>
          <div id="winnerSection" className="hidden">
            <div className="mb-8">
              <img
                id="trophyImage"
                src="https://cdn-icons-png.flaticon.com/512/3112/3112946.png"
                alt="Trophy"
                className="w-32 h-32 mx-auto mb-4"
              />
              <h3
                id="winnerMessage"
                className="text-2xl font-bold text-green-600"
              >
                You Won!
              </h3>
              <p id="winnerDesc" className="text-gray-300 mt-2">
                Congratulations on your victory!
              </p>
            </div>
          </div>
          <div id="loserSection" className="hidden">
            <div className="mb-8">
              <img
                id="loseImage"
                src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png"
                alt="Lose"
                className="w-32 h-32 mx-auto mb-4"
              />
              <h3 id="loserMessage" className="text-2xl font-bold text-red-600">
                You Lost!
              </h3>
              <p id="loserDesc" className="text-gray-300 mt-2">
                Better luck next time!
              </p>
            </div>
          </div>
          <button
            id="playAgainButton"
            onClick="playAgain()"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-10 rounded-full shadow-md transition duration-300 hidden"
          >
            PLAY AGAIN
          </button>
        </div>
      </div>
    </>
  );
}
