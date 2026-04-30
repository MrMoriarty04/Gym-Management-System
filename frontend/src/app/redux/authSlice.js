"use client"; 

import { createSlice } from '@reduxjs/toolkit';

const getUserFromStorage = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  return null;
};

const initialState = {
  user: getUserFromStorage(), 
};

const authSlice = createSlice({
  name: 'auth', 
  initialState,
  
  reducers: {
    setReducers: (state, action) => {
      state.user = action.payload; 
      
      localStorage.setItem('user', JSON.stringify(action.payload));
    },

    logout: (state) => {
      state.user = null; 
      localStorage.removeItem('user');
    },
  },
});

export const { setReducers, logout } = authSlice.actions;

export default authSlice.reducer;