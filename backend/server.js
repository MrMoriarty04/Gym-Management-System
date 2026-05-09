require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const app = express();

const { protect, authorize } = require("./middlewares/authMiddleware");
const { chatWithAI } = require("./controllers/aiController");

connectDB();

app.use(cookieParser());

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json());

app.get("/api/ai/ping", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.post("/api/ai/chat", protect, authorize("trainee"), chatWithAI);

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

const workoutRoutes = require("./routes/workoutRoutes");
app.use("/api/workouts", workoutRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const coachRoutes = require("./routes/coachRoutes");
app.use("/api/coach", coachRoutes);

const traineeRoutes = require("./routes/traineeRoutes");
app.use("/api/trainee", traineeRoutes);

const sessionRoutes = require("./routes/sessionRoutes");
app.use("/api/sessions", sessionRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const aiRoutes = require("./routes/aiRoutes");
app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 5000;

const dietRoutes = require("./routes/dietRoutes");

app.use("/api/diet", dietRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port: http://localhost:${PORT}`);
});
