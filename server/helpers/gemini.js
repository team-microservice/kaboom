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

/**
 * Implements delay function for retry mechanism
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} - Promise that resolves after the delay
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generates content using Gemini API with retry capabilities
 * @param {string} prompt - The prompt to send to Gemini
 * @param {string} modelName - The model name to use
 * @param {number} maxRetries - Maximum number of retries
 * @returns {Promise<string>} - The generated content
 */
const generateContent = async (prompt, modelName = "gemini-1.5-pro", maxRetries = 3) => {
  let retries = 0;
  
  while (true) {
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
      
      // Check if it's a rate limit error (429)
      if (error.status === 429) {
        if (retries < maxRetries) {
          const retryDelay = Math.pow(2, retries) * 1000;
          console.log(`Rate limit exceeded. Retrying in ${retryDelay}ms (Attempt ${retries + 1}/${maxRetries})`);
          retries++;
          await delay(retryDelay);
          continue;
        } else {
          error.isRateLimit = true;
        }
      }
      
      throw error;
    }
  }
};

module.exports = {
  initGemini,
  getGeminiModel,
  generateContent,
};
