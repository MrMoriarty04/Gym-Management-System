const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "coach", "trainee"],
      default: "trainee",
    },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

userSchema.index({ email: 1 });

module.exports = mongoose.model("User", userSchema);
