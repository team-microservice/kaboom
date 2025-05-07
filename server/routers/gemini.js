const express = require("express");
const GeminiController = require("../controllers/GeminiController");
const router = express.Router();

router.get("/generate-quiz", GeminiController.generateQuiz);
router.get("/fallback-quiz", (req, res) => {
  req.query.fallback = 'true';
  return GeminiController.generateQuiz(req, res);
});

module.exports = router;
