const express = require("express");

const {
  getMyWorkoutRoutine,
  getSettingsProfile,
  updateSettingsProfile,
} = require("../controllers/traineeController");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/workout", protect, authorize("trainee"), getMyWorkoutRoutine);
router.get("/profile", protect, getSettingsProfile);
router.put("/update-profile", protect, updateSettingsProfile);
module.exports = router;
