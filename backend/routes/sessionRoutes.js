const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware"); 

const {
  getSessions,
  bookSession,
  updateSession,
  deleteSession,
} = require("../controllers/sessionController");

router.get("/", protect, getSessions)
router.post("/", protect, bookSession); 
router.put("/:id", protect, updateSession); 
router.delete("/:id", protect, deleteSession); 

module.exports = router;