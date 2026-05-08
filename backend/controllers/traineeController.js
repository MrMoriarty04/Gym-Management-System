const WorkoutRoutine = require("../models/WorkoutRoutine");
const TraineeProfile = require("../models/TraineeProfile");
const User = require("../models/User");

const DAY_SORT_ORDER = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 7,
};

const getMyWorkoutRoutine = async (req, res) => {
  try {
    const traineeId = req.user && req.user._id;

    const routines = await WorkoutRoutine.find({ traineeId })
      .populate("coachId", "name email")
      .lean();

    routines.sort((a, b) => {
      return (
        (DAY_SORT_ORDER[a.dayOfWeek] || 99) -
        (DAY_SORT_ORDER[b.dayOfWeek] || 99)
      );
    });

    return res.status(200).json({
      count: routines.length,
      weeklyRoutine: routines,
    });
  } catch (error) {
    console.error("getMyWorkoutRoutine error:", error);
    return res.status(500).json({ message: "Failed to fetch workout routine" });
  }
};

const getSettingsProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const profile = await TraineeProfile.findOne({ user: userId }).populate("user", "name email");

    if (!profile) {
      return res.status(200).json({
        user: { name: req.user.name, email: req.user.email },
        heightCm: "",
        weightKg: "",
        fitnessGoal: ""
      });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("getSettingsProfile error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateSettingsProfile = async (req, res) => {
  try {
    const { name, bio, height, weight } = req.body;
    const userId = req.user._id;

    if (name) {
      await User.findByIdAndUpdate(userId, { name });
    }

    const updatedProfile = await TraineeProfile.findOneAndUpdate(
      { user: userId },
      { heightCm: height, weightKg: weight, fitnessGoal: bio },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: "Updated successfully", updatedProfile });
  } catch (error) {
    console.error("updateSettingsProfile error:", error);
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

module.exports = {
  getMyWorkoutRoutine,
  getSettingsProfile,
  updateSettingsProfile
};