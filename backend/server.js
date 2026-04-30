require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const app = express();
connectDB();
app.use(cookieParser());

app.use(cors()); 
app.use(express.json()); 


const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);


const workoutRoutes = require('./routes/workoutRoutes');
app.use('/api/workouts', workoutRoutes);





const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(  `Server is running on port: http://localhost:${PORT}`);
});