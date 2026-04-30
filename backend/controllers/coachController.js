const User = require("../models/User");
const TraineeProfile = require("../models/TraineeProfile");
const WorkoutRoutine = require("../models/WorkoutRoutine");

const POST_DAY_VALUES = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const createWorkoutRoutine = async (req, res) => {
  try {
    const coachId = req.user && req.user._id;
    const { traineeId, dayOfWeek, exerciseList } = req.body;

    if (
      !traineeId ||
      !dayOfWeek ||
      !Array.isArray(exerciseList) ||
      exerciseList.length === 0
    ) {
      return res.status(400).json({
        message: "traineeId, dayOfWeek and non-empty exerciseList are required",
      });
    }

    const normalizedDay = String(dayOfWeek).toLowerCase();
    if (!POST_DAY_VALUES.includes(normalizedDay)) {
      return res.status(400).json({ message: "Invalid dayOfWeek value" });
    }

    const trainee = await User.findOne({
      _id: traineeId,
      role: "trainee",
    }).select("_id name email role");
    if (!trainee) {
      return res.status(404).json({ message: "Trainee not found" });
    }

    const profile = await TraineeProfile.findOne({
      user: traineeId,
      assignedCoach: coachId,
    });
    if (!profile) {
      return res
        .status(403)
        .json({ message: "This trainee is not assigned to the current coach" });
    }

    const routine = await WorkoutRoutine.create({
      coachId,
      traineeId,
      dayOfWeek: normalizedDay,
      exerciseList,
    });

    return res.status(201).json({
      message: "Workout routine created successfully",
      routine,
    });
  } catch (error) {
    console.error("createWorkoutRoutine error:", error);
    return res
      .status(500)
      .json({ message: "Failed to create workout routine" });
  }
};

const getAssignedTrainees = async (req, res) => {
  try {
    const coachId = req.user && req.user._id;

    const trainees = await TraineeProfile.find({ assignedCoach: coachId })
      .populate({
        path: "user",
        select: "name email role isVerified",
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: trainees.length,
      trainees,
    });
  } catch (error) {
    console.error("getAssignedTrainees error:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch assigned trainees" });
  }
};

module.exports = {
  createWorkoutRoutine,
  getAssignedTrainees,
};
