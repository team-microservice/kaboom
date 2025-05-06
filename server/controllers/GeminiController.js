const { generateContent } = require("../helpers/gemini");

class GeminiController {
  static async generateQuiz(req, res) {
    try {
      const prompt = `Generate 10 multiple-choice questions about Indonesia in Bahasa Indonesia. 
          For each question, provide 4 options and indicate the index (0-based) of the correct answer.
          Format the response as a JSON object with this exact structure:
          {
            "questions": [
              { "question": "question text in Bahasa Indonesia", "choices": ["option1", "option2", "option3", "option4"], "correctAnswer": correctAnswerIndex },
              ...
            ]
          }
          Only return the JSON, nothing else. Make sure all questions, options, and explanations are written in Bahasa Indonesia.`;

      const result = await generateContent(prompt);

      try {
        const quiz = JSON.parse(result);
        return res.status(200).json(quiz);
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        return res.status(500).json({ error: "Failed to parse quiz data" });
      }
    } catch (error) {
      console.error("Error generating quiz:", error);
      return res.status(500).json({ error: "Failed to generate quiz" });
    }
  }
}

module.exports = GeminiController;
