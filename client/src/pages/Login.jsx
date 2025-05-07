import { useContext, useState } from "react";
import "../App";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import ThemeContext from "../contexts/theme";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const contet = useContext(ThemeContext);
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      if (!username) throw { message: "Username is required" };
      localStorage.setItem("username", username);
      navigate("/waiting-room");
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error.message,
        title: "Error",
      });
    }
  };

  return (
    <div>
      <div className="w-screen min-h-screen bg-cover bg-center flex items-center justify-center relative lightBackground">
        <div
          id="overlay"
          className="absolute inset-0 z-0 transition duration-500 lightOverlay"
        />
        <div id="snowfall-container" />
        {/* Toggle Button */}
        {/* Toggle Button */}
        <button
          id="toggleMode"
          className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20 bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-700 transition"
        >
          Dark Mode
        </button>
        <div
          id="card"
          className="bg-white border-4 border-blue-400 rounded-2xl p-10 w-1/2 text-center relative z-10 shadow-xl transition duration-500"
        >
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-2 rounded-full font-bold shadow-md text-sm">
            WELCOME
          </div>
          <h2 id="title" className="text-2xl font-bold text-gray-800 mb-6">
            Kaboom!
          </h2>
          <form
          onSubmit={handleLogin}
          > 
            <div className="flex items-center bg-gray-100 rounded-full px-5 py-3 mb-6">
              <i className="fas fa-user text-gray-500 text-lg mr-3" />
              <input
                type="text"
                placeholder="Enter your username"
                required=""
                className="bg-transparent focus:outline-none text-base w-full"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-10 rounded-full shadow-md transition duration-300"
            >
              START
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
