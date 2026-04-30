const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema(
  {
    exerciseName: {
      type: String,
      required: true,
      trim: true,
    },
    sets: {
      type: Number,
      required: true,
      min: 1,
    },
    reps: {
      type: Number,
      required: true,
      min: 1,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { _id: false },
);

const workoutRoutineSchema = new mongoose.Schema(
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
    dayOfWeek: {
      type: String,
      enum: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ],
      required: true,
      lowercase: true,
    },
    exerciseList: {
      type: [exerciseSchema],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "At least one exercise is required",
      },
    },
  },
  { timestamps: true },
);

workoutRoutineSchema.index({ traineeId: 1, dayOfWeek: 1 });

module.exports = mongoose.model("WorkoutRoutine", workoutRoutineSchema);
