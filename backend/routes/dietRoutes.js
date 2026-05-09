const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/authMiddleware"); 

const { getTodayDietSummary ,logMealWithAI  } = require("../controllers/dietController");

router.get("/summary", protect, getTodayDietSummary);
router.post('/log-meal', protect, logMealWithAI)
;module.exports = router;