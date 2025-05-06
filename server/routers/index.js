const Controller = require("../controllers/GeminiController");
const express = require("express");
const router = express.Router();

router.use("/gemini", require("./gemini"));

module.exports = router;
