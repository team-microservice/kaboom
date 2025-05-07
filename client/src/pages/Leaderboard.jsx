import { useContext } from "react";
import "../App.css";
import ThemeContext from "../contexts/theme";

export default function Leaderboard() {
  const context = useContext(ThemeContext);
  return (
    <>
      <div
        className={`w-screen min-h-screen bg-cover bg-center flex items-center justify-center relative ${context.theme}Background`}
      >
        <div
          id="overlay"
          class={`absolute inset-0 z-0 transition duration-500 ${context.theme}Overlay`}    
        ></div>
        <div id="snowfall-container" />
        {/* Back Button (top-left) */}
        <div className="absolute top-5 left-5 z-10">
          <button
            onclick="history.back()"
            className="bg-white bg-opacity-90 px-4 py-2 rounded-full shadow-md font-semibold text-red-600 hover:bg-opacity-100 transition"
            id="backButton"
          >
            ← Back to Home
          </button>
        </div>
        {/* Leaderboard Box */}
        <div
          id="card"
          className={`rounded-2xl p-10 w-[600px] text-center relative z-10 shadow-xl transition duration-500 ${context.theme}Card `}
        >
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-2 rounded-full font-bold shadow-md text-sm">
            LEADERBOARD
          </div>
          <h2 id="title" className="text-2xl font-bold mb-6">
            Top Players
          </h2>
          <div className="text-left space-y-4">
            {/* Player Row Example */}
            <div className="flex justify-between bg-gray-700 rounded-full px-6 py-3 shadow playerRow transition duration-500">
              <span className="font-semibold text-white">1. Arya</span>
              <span className="text-green-400 font-bold">150 pts</span>
            </div>
            <div className="flex justify-between bg-gray-700 rounded-full px-6 py-3 shadow playerRow transition duration-500">
              <span className="font-semibold text-white">2. Bella</span>
              <span className="text-green-400 font-bold">130 pts</span>
            </div>
            <div className="flex justify-between bg-gray-700 rounded-full px-6 py-3 shadow playerRow transition duration-500">
              <span className="font-semibold text-white">3. Chandra</span>
              <span className="text-green-400 font-bold">120 pts</span>
            </div>
            <div className="flex justify-between bg-gray-700 rounded-full px-6 py-3 shadow playerRow transition duration-500">
              <span className="font-semibold text-white">4. Diah</span>
              <span className="text-green-400 font-bold">100 pts</span>
            </div>
            <div className="flex justify-between bg-gray-700 rounded-full px-6 py-3 shadow playerRow transition duration-500">
              <span className="font-semibold text-white">5. Edo</span>
              <span className="text-green-400 font-bold">90 pts</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
