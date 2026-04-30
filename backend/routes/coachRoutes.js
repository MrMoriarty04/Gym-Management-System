const express = require('express');

const { createWorkoutRoutine, getAssignedTrainees } = require('../controllers/coachController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/workouts', protect, authorize('coach'), createWorkoutRoutine);
router.get('/trainees', protect, authorize('coach'), getAssignedTrainees);

module.exports = router;
