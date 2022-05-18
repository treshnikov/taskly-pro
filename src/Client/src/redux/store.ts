import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./authSlice"
import projectDetailsReducer from "./projectDetailsSlice"

export const store = configureStore({
  reducer: {
    authReducer,
    projectDetailsReducer
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch