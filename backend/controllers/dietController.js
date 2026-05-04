const Diet = require("../models/Diet");
const DietPlan = require("../models/DietPlan");

const getTodayDietSummary = async (req, res) => {
  try {
    const traineeId = req.user._id;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayDiet = await Diet.findOne({
      traineeId,
      date: { $gte: startOfDay, $lte: endOfDay } 
    });

    let targetCalories = 0;
    let consumedCalories = 0;

    if (todayDiet) {
      targetCalories = todayDiet.targetedDiet.calories || 0;
      consumedCalories = todayDiet.totalConsumed.calories || 0;
    } else {
      const latestPlan = await DietPlan.findOne({ traineeId }).sort({ createdAt: -1 });
      if (latestPlan) {
        targetCalories = latestPlan.dailyCalories || 0;
      }
    }

    const remainingCalories = targetCalories - consumedCalories;

    return res.status(200).json({
      targetCalories,
      consumedCalories,
      remainingCalories: remainingCalories > 0 ? remainingCalories : 0 
    });

  } catch (error) {
    console.error("Error in getTodayDietSummary:", error);
    return res.status(500).json({ message: "Server error fetching diet summary" });
  }
};

module.exports = {
  getTodayDietSummary,
};