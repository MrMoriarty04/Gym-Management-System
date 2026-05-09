"use client";

import { createSlice } from "@reduxjs/toolkit";

const getUserFromStorage = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user);
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  }
  return null;
};

const extractUser = (payload) => {
  if (!payload) {
    return null;
  }

  if (payload.user) {
    return payload.user;
  }

  return payload;
};

const initialState = {
  user: getUserFromStorage(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setUser: (state, action) => {
      const user = extractUser(action.payload);
      state.user = user;

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
    },

    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
  },
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;
