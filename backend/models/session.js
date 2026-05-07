const mongoose = require("mongoose");
 
const sessionSchema = new mongoose.Schema(
  {
    traineeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    coachId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    status: { type: String, enum: ["scheduled", "completed", "cancelled"], default: "scheduled" },
    location: { type: String },
  },
  { timestamps: true },
);  
module.exports = mongoose.model("Session", sessionSchema);