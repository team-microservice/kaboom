const { GoogleGenerativeAI } = require("@google/generative-ai");

const initGemini = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in the environment variables");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI;
};

const getGeminiModel = (modelName = "gemini-1.5-pro") => {
  const genAI = initGemini();
  return genAI.getGenerativeModel({ model: modelName });
};

const generateContent = async (prompt, modelName = "gemini-1.5-pro") => {
  try {
    const model = getGeminiModel(modelName);
    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    
    if (responseText.startsWith("```") && responseText.endsWith("```")) {
      const jsonStartIndex = responseText.indexOf('\n') + 1;
      const jsonEndIndex = responseText.lastIndexOf('```');
      
      responseText = responseText.substring(jsonStartIndex, jsonEndIndex).trim();
    }
    
    return responseText;
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    throw error;
  }
};

module.exports = {
  initGemini,
  getGeminiModel,
  generateContent,
};
