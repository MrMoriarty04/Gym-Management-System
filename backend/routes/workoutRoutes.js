const express = require('express');
const router = express.Router();
const { authorized } = require('../middlewares/authMiddleware');
const { createWorkout, getWorkouts,updateWorkout,deleteWorkout } = require('../controllers/workoutController');

router.post('/',authorized, createWorkout);


router.get('/:traineeId',authorized, getWorkouts);

router.put('/:workoutId',authorized, updateWorkout);

router.delete('/:workoutId',authorized, deleteWorkout);
module.exports = router;