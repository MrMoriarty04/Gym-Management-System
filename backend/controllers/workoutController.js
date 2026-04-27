const Workout = require('../models/Workout');

const createWorkout = async (req, res) => {
  try {
    const { traineeId ,coachId,title,date,exercises} = req.body;

    if (!traineeId || !coachId || !title || !date || !exercises || exercises.length === 0) {
      return res.status(400).json({ message: "Please provide required fields" });
    }

    const workout = await Workout.create({
      traineeId,
      coachId,
      title,
      date,
      exercises
    });
    res.status(201).json({ message: "Workout created successfully", workout });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getWorkouts = async (req, res) => {
  try {
    const { traineeId } =req.params

   const workouts = await Workout.find({ traineeId }).populate('coachId', 'name');

    if (!workouts) {
      return res.status(404).json({ message: "No workouts found" });
    }

    res.status(200).json(workouts);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
const updateWorkout = async (req, res) => {
  try {
    const { workoutId } = req.params;
    
    const updates = req.body;

    const updatedWorkout = await Workout.findByIdAndUpdate(workoutId, updates, { new: true });

    if (!updatedWorkout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    res.status(200).json({ message: "Workout updated successfully", workout: updatedWorkout });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while updating workout" });
  }
};


const deleteWorkout = async (req, res) => {
  try {
    const { workoutId } = req.params;

    const deletedWorkout = await Workout.findByIdAndDelete(workoutId);

    if (!deletedWorkout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    res.status(200).json({ message: "Workout deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while deleting workout" });
  }
};
module.exports = {
  createWorkout,
  getWorkouts,
  updateWorkout,
  deleteWorkout
};