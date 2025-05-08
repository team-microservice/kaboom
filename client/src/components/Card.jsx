import "../App.css";

export default function Card(props) {
  const { currentQuestion, currentQuestionIndex, handleSubmit, context, selectedAnswer, questions, setSelectedAnswer } = props;
  // const {}
  return (
    <>
      <div
        id="card"
        className={`${context.theme}Card border-[5px] rounded-2xl p-10 w-[600px] text-center relative z-10 shadow-xl transition duration-500 text-white`}
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
                  parseInt(selectedAnswer) === index
                    ? "border-2 border-green-500"
                    : ""
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
            className="btn btn-success btn-active"
            disabled={!selectedAnswer}
          >
            SUBMIT
          </button>
        </form>
        <div className="mt-4 text-sm">
          Question {currentQuestionIndex + 1} of {questions.questions.length}
        </div>
      </div>
    </>
  );
}
