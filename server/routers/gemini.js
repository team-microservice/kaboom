const express = require("express");
const GeminiController = require("../controllers/GeminiController");
const router = express.Router();

router.get("/generate-quiz", GeminiController.generateQuiz);
// Add dedicated fallback endpoint that always returns fallback data
router.get("/fallback-quiz", (req, res) => {
  req.query.fallback = 'true';
  return GeminiController.generateQuiz(req, res);
});

module.exports = router;
