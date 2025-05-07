import { useState } from "react";
import "../App";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { useState } from "react";
import "../App";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      if (!username) throw { message: "Username is required" };
      localStorage.setItem("username", username);
      navigate("/landing-page");
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error.message,
        title: "Error",
      });
    }
  };

  return (
    <>
      <>
        <div
          id="overlay"
          className="absolute inset-0 bg-white bg-opacity-40 z-0 transition duration-500"
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
          className="bg-white border-[5px] border-blue-400 rounded-2xl p-10 w-[500px] text-center relative z-10 shadow-xl transition duration-500"
        >
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-2 rounded-full font-bold shadow-md text-sm">
            WELCOME
          </div>
          <h2 id="title" className="text-2xl font-bold text-gray-800 mb-6">
            Just Play a Micro Service Quiz
          </h2>
          <form>
            <div className="flex items-center bg-gray-100 rounded-full px-5 py-3 mb-6">
              <i className="fas fa-user text-gray-500 text-lg mr-3" />
              <input
                type="text"
                placeholder="Enter your username"
                required=""
                className="bg-transparent focus:outline-none text-base w-full"
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
      </>
    </>
  );
}
