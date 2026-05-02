"use client";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentDiet: null,
  isLoading: false,
};

const dietSlice = createSlice({
  name: "diet",
  initialState,

  reducers: {
    setDiet: (state, action) => {
      state.currentDiet = action.payload;
    },

    addMealToDiet: (state, action) => {
      if (state.currentDiet && state.currentDiet.meals) {
        state.currentDiet.meals.push(action.payload);
      }
    },

    updateTotalConsumed: (state, action) => {
      if (state.currentDiet) {
        state.currentDiet.totalConsumed = action.payload;
      }
    },

    clearDiet: (state) => {
      state.currentDiet = null;
    },
  },
});

export const { setDiet, addMealToDiet, updateTotalConsumed, clearDiet } =
  dietSlice.actions;

export default dietSlice.reducer;
