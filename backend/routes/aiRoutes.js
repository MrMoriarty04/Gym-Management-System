const express = require("express");

const { protect, authorize } = require("../middlewares/authMiddleware");
const { chatWithAI } = require("../controllers/aiController");

const router = express.Router();

router.post("/chat", protect, authorize("trainee"), chatWithAI);

module.exports = router;
