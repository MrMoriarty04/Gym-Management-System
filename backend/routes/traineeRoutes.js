const express = require('express');

const { getMyWorkoutRoutine } = require('../controllers/traineeController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/workout', protect, authorize('trainee'), getMyWorkoutRoutine);

module.exports = router;
