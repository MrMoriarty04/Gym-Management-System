"use client";
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  workouts: [] ,
  isLoading: false, 
};

const workoutSlice = createSlice({
  name: 'workouts',
  initialState,
  
  reducers: {
    setWorkouts: (state, action) => {
      state.workouts = action.payload; 
    },

    addWorkout: (state, action) => {
      state.workouts.push(action.payload); 
    },

    removeWorkout: (state, action) => {
      state.workouts = state.workouts.filter(
        (workout) => workout._id !== action.payload
      );
    },
    
    updateWorkoutInStore: (state, action) => {
         const index = state.workouts.findIndex(w => w._id === action.payload._id);
         if(index !== -1){
             state.workouts[index] = action.payload;
         }
    }
  },
});

export const { setWorkouts, addWorkout, removeWorkout, updateWorkoutInStore } = workoutSlice.actions; 

export default workoutSlice.reducer;