const mongoose = require("mongoose");

const traineeProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    heightCm: {
      type: Number,
      min: 50,
      max: 280,
    },
    weightKg: {
      type: Number,
      min: 20,
      max: 400,
    },
    age: {
      type: Number,
      min: 10,
      max: 100,
    },
    fitnessGoal: {
      type: String,
      trim: true,
    },
    currentSubscriptionTier: {
      type: Number,
      enum: [1, 3, 6, 12],
      default: 1,
    },
    assignedCoach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

traineeProfileSchema.index({ assignedCoach: 1 });

module.exports = mongoose.model("TraineeProfile", traineeProfileSchema);
