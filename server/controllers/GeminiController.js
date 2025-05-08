const { generateContent } = require("../helpers/gemini");

const fallbackQuizData = {
  "questions": [
    {
      "question": "Apa nama ibukota Indonesia?",
      "choices": ["Jakarta", "Surabaya", "Bandung", "Medan"],
      "correctAnswer": 0
    },
    {
      "question": "Berapa banyak provinsi di Indonesia saat ini?",
      "choices": ["33", "34", "35", "36"],
      "correctAnswer": 1
    },
    {
      "question": "Kapan Indonesia memproklamasikan kemerdekaannya?",
      "choices": ["17 Agustus 1945", "17 Agustus 1949", "17 Agustus 1950", "17 Agustus 1944"],
      "correctAnswer": 0
    },
    {
      "question": "Siapakah Presiden pertama Indonesia?",
      "choices": ["Soekarno", "Soeharto", "BJ Habibie", "Megawati Soekarnoputri"],
      "correctAnswer": 0
    },
    {
      "question": "Pulau manakah yang terbesar di Indonesia?",
      "choices": ["Jawa", "Sumatra", "Kalimantan", "Papua"],
      "correctAnswer": 2
    },
    {
      "question": "Apa nama mata uang Indonesia?",
      "choices": ["Peso", "Rupiah", "Ringgit", "Baht"],
      "correctAnswer": 1
    },
    {
      "question": "Gunung tertinggi di Indonesia adalah?",
      "choices": ["Gunung Kerinci", "Gunung Rinjani", "Gunung Semeru", "Puncak Jaya"],
      "correctAnswer": 3
    },
    {
      "question": "Danau terbesar di Indonesia adalah?",
      "choices": ["Danau Toba", "Danau Sentani", "Danau Poso", "Danau Maninjau"],
      "correctAnswer": 0
    },
    {
      "question": "Apa lambang negara Indonesia?",
      "choices": ["Macan", "Komodo", "Burung Elang", "Garuda"],
      "correctAnswer": 3
    },
    {
      "question": "Semboyan negara Indonesia adalah?",
      "choices": ["Bersatu kita teguh", "Sekali merdeka tetap merdeka", "Bhinneka Tunggal Ika", "Merdeka atau mati"],
      "correctAnswer": 2
    }
  ]
};

class GeminiController {
  static async generateQuiz(req, res) {
    try {
      const useFallback = req.query.fallback === 'true';
      
      // If fallback is explicitly requested, return the fallback data immediately
      if (useFallback) {
        console.log("Using fallback quiz data (requested by client)");
        return res.status(200).json(fallbackQuizData);
      }
      
      const prompt = `Generate 10 multiple-choice questions about random fun facts in this world in Bahasa Indonesia. 
          For each question, provide 4 options and indicate the index (0-based) of the correct answer.
          Format the response as a JSON object with this exact structure:
          {
            "questions": [
              { "question": "question text in Bahasa Indonesia", "choices": ["option1", "option2", "option3", "option4"], "correctAnswer": correctAnswerIndex },
              ...
            ]
          }
          Only return the JSON, nothing else. Make sure all questions, options, and explanations are written in Bahasa Indonesia.`;

      try {
        const result = await generateContent(prompt);
        const quiz = JSON.parse(result);
        return res.status(200).json(quiz);
      } catch (error) {
        console.error("Error generating or parsing quiz:", error);
        
        if (error.isRateLimit || error.status === 429) {
          console.log("API rate limit exceeded. Using fallback quiz data.");
          return res.status(200).json({
            ...fallbackQuizData,
            source: "fallback",
            message: "Quiz generated from fallback data due to API rate limits"
          });
        }
        
        if (error instanceof SyntaxError) {
          console.log("Failed to parse API response. Using fallback quiz data.");
          return res.status(200).json({
            ...fallbackQuizData,
            source: "fallback",
            message: "Quiz generated from fallback data due to parsing error"
          });
        }
        
        return res.status(500).json({ 
          error: "Failed to generate quiz", 
          message: error.message 
        });
      }
    } catch (error) {
      console.error("Unexpected error in generateQuiz:", error);
      return res.status(500).json({ 
        error: "Unexpected error", 
        message: error.message,
        source: "fallback",
        ...fallbackQuizData
      });
    }
  }
}

module.exports = GeminiController;
