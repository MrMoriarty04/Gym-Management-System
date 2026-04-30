const mongoose = require("mongoose");

const dietSchema = new mongoose.Schema(
  {
    traineeId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    date: { type: Date, required: true },
    targetedDiet: {
      calories: { type: Number, required: true },
      protein: { type: Number, required: true },
      carbs: { type: Number, required: true },
      fat: { type: Number, required: true },
    },
    meals: [
      {
        mealName: { type: String, required: true },
        ingredients: { type: String, required: true },
        aiCalculatedCalories: { type: Number, default: 0 },
        aiCalculatedProtein: { type: Number, default: 0 },
        aiCalculatedCarbs: { type: Number, default: 0 },
        aiCalculatedFat: { type: Number, default: 0 },
      },
    ],

    totalConsumed: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Diet", dietSchema);
