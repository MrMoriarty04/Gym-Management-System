const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { createWorkout, getWorkouts,updateWorkout,deleteWorkout } = require('../controllers/workoutController');

router.post('/',protect, createWorkout);


router.get('/:traineeId',protect, getWorkouts);

router.put('/:workoutId',protect, updateWorkout);

router.delete('/:workoutId',protect, deleteWorkout);
module.exports = router;