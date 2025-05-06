const express = require("express");
const GeminiController = require("../controllers/GeminiController.js");
const router = express.Router();

router.get("/generate-quiz", GeminiController.generateQuiz);

module.exports = router;
