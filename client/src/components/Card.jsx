import "../App.css"

export default function Card() {
    return(
        <>
            <div
          id="card"
          className="bg-gray-900 border-[5px] border-orange-500 rounded-2xl p-10 w-[600px] text-center relative z-10 shadow-xl transition duration-500 text-white"
        >
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-2 rounded-full font-bold shadow-md text-sm">
            QUIZ TIME
          </div>
          <h2 id="title" className="text-2xl font-bold mb-6">
            What's the capital of Indonesia?
          </h2>
          <form id="quizForm">
            <div className="grid grid-cols-2 gap-4 mb-6 text-left">
              <label
                id="answerA"
                className="flex items-center bg-gray-700 px-4 py-3 rounded-full cursor-pointer hover:bg-gray-600 transition text-white"
              >
                <input
                  type="radio"
                  name="answer"
                  defaultValue="A"
                  className="mr-2"
                />
                A. Jakarta
              </label>
              <label
                id="answerB"
                className="flex items-center bg-gray-700 px-4 py-3 rounded-full cursor-pointer hover:bg-gray-600 transition text-white"
              >
                <input
                  type="radio"
                  name="answer"
                  defaultValue="B"
                  className="mr-2"
                />
                B. Bandung
              </label>
              <label
                id="answerC"
                className="flex items-center bg-gray-700 px-4 py-3 rounded-full cursor-pointer hover:bg-gray-600 transition text-white"
              >
                <input
                  type="radio"
                  name="answer"
                  defaultValue="C"
                  className="mr-2"
                />
                C. Surabaya
              </label>
              <label
                id="answerD"
                className="flex items-center bg-gray-700 px-4 py-3 rounded-full cursor-pointer hover:bg-gray-600 transition text-white"
              >
                <input
                  type="radio"
                  name="answer"
                  defaultValue="D"
                  className="mr-2"
                />
                D. Medan
              </label>
            </div>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-10 rounded-full shadow-md transition duration-300"
            >
              SUBMIT
            </button>
          </form>
          <div
            id="result"
            className="mt-4 text-lg font-semibold text-blue-300 hidden"
          />
        </div>
        </>
    )
}