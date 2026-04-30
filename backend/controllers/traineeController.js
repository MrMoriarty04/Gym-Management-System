const WorkoutRoutine = require("../models/WorkoutRoutine");

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

module.exports = {
  getMyWorkoutRoutine,
};
