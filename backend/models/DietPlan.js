const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema(
  {
    mealName: {
      type: String,
      required: true,
      trim: true,
    },
    calories: {
      type: Number,
      default: 0,
      min: 0,
    },
    protein: {
      type: Number,
      default: 0,
      min: 0,
    },
    carbs: {
      type: Number,
      default: 0,
      min: 0,
    },
    fat: {
      type: Number,
      default: 0,
      min: 0,
    },
    ingredients: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { _id: false },
);

const dietPlanSchema = new mongoose.Schema(
  {
    coachId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    traineeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    dailyCalories: {
      type: Number,
      required: true,
      min: 0,
    },
    macros: {
      protein: { type: Number, min: 0, default: 0 },
      carbs: { type: Number, min: 0, default: 0 },
      fats: { type: Number, min: 0, default: 0 },
    },
    mealBreakdown: {
      type: [mealSchema],
      default: [],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("DietPlan", dietPlanSchema);
