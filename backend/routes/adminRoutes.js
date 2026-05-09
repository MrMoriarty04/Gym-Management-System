const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middlewares/authMiddleware");
const {
  getAdminDashboardSummary,
  getAdminUsers,
  getAssignmentData,
  assignTraineeToCoach,
  getPaymentsOverview,
  updateUserByAdmin,
  deleteUserByAdmin,
} = require("../controllers/adminController");

router.get("/dashboard", protect, authorize("admin"), getAdminDashboardSummary);
router.get("/users", protect, authorize("admin"), getAdminUsers);
router.put("/users/:id", protect, authorize("admin"), updateUserByAdmin);
router.delete("/users/:id", protect, authorize("admin"), deleteUserByAdmin);
router.get("/assignments", protect, authorize("admin"), getAssignmentData);
router.post("/assignments", protect, authorize("admin"), assignTraineeToCoach);
router.get("/payments", protect, authorize("admin"), getPaymentsOverview);

module.exports = router;
