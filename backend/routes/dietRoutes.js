const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/authMiddleware"); 

const { getTodayDietSummary } = require("../controllers/dietController");

router.get("/summary", protect, getTodayDietSummary);

module.exports = router;