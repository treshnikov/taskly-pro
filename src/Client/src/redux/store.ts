import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import projectDetailsReducer from "./projectDetailsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projectDetails: projectDetailsReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
