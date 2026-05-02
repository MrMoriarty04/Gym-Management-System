import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import workoutReducer from "./workoutSlice";
import dietReducer from "./dietSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    workout: workoutReducer,
    diet: dietReducer,
  },
});

export default store;
