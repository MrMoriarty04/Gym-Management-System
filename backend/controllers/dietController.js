const Diet = require("../models/Diet");
const DietPlan = require("../models/DietPlan");
const { analyzeMealLog } = require("../services/aiService"); 

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

const logMealWithAI = async (req, res) => {
  try {
    const { text } = req.body;
    const traineeId = req.user._id;

    if (!text) return res.status(400).json({ message: "Meal text is required" });

    const aiResult = await analyzeMealLog(text);
    if (!aiResult) return res.status(500).json({ message: "AI failed to analyze the meal" });

    const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(); endOfDay.setHours(23, 59, 59, 999);

    let todayDiet = await Diet.findOne({ traineeId, date: { $gte: startOfDay, $lte: endOfDay } });

    if (!todayDiet) {
      const latestPlan = await DietPlan.findOne({ traineeId }).sort({ createdAt: -1 });
      todayDiet = new Diet({
        traineeId,
        date: new Date(),
        targetedDiet: {
          calories: latestPlan ? latestPlan.dailyCalories : 0,
          protein: latestPlan ? latestPlan.macros.protein : 0,
          carbs: latestPlan ? latestPlan.macros.carbs : 0,
          fat: latestPlan ? latestPlan.macros.fats : 0,
        },
        meals: [],
        totalConsumed: { calories: 0, protein: 0, carbs: 0, fat: 0 }
      });
    }

    const newMeal = {
      mealName: aiResult.mealName || "AI Logged Meal",
      ingredients: aiResult.ingredients || text,
      aiCalculatedCalories: aiResult.calories || 0,
      aiCalculatedProtein: aiResult.protein || 0,
      aiCalculatedCarbs: aiResult.carbs || 0,
      aiCalculatedFat: aiResult.fat || 0,
    };

    todayDiet.meals.push(newMeal);
    todayDiet.totalConsumed.calories += newMeal.aiCalculatedCalories;
    todayDiet.totalConsumed.protein += newMeal.aiCalculatedProtein;
    todayDiet.totalConsumed.carbs += newMeal.aiCalculatedCarbs;
    todayDiet.totalConsumed.fat += newMeal.aiCalculatedFat;

    await todayDiet.save();
    res.status(200).json({ message: "Meal logged successfully", meal: newMeal });
  } catch (error) {
    console.error("logMealWithAI Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getTodayDietSummary, logMealWithAI };