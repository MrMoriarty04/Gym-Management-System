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
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    const latestPlan = await DietPlan.findOne({ traineeId }).sort({
      createdAt: -1,
    });

    const targetCalories = latestPlan ? latestPlan.dailyCalories : 0;
    const targetProtein = latestPlan ? latestPlan.macros.protein : 0;
    const targetCarbs = latestPlan ? latestPlan.macros.carbs : 0;
    const targetFat = latestPlan ? latestPlan.macros.fats : 0;

    const summary = {
      calories: {
        target: targetCalories,
        consumed: todayDiet ? todayDiet.totalConsumed.calories : 0,
      },
      macros: {
        protein: {
          target: targetProtein,
          consumed: todayDiet ? todayDiet.totalConsumed.protein : 0,
        },
        carbs: {
          target: targetCarbs,
          consumed: todayDiet ? todayDiet.totalConsumed.carbs : 0,
        },
        fat: {
          target: targetFat,
          consumed: todayDiet ? todayDiet.totalConsumed.fat : 0,
        },
      },
      meals: todayDiet ? todayDiet.meals : [],
    };

    return res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getTodayDietSummary };
