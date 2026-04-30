const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema(
  {
    traineeId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    coachId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    date: { type: Date, required: true },

    exercises: [
      {
        name: { type: String, required: true },
        sets: { type: Number, required: true },
        reps: { type: Number, required: true },
        notes: { type: String },
      },
    ],
    traineeFeedback: { type: String },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Workout", workoutSchema);
