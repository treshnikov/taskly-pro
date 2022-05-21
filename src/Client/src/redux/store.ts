import { configureStore } from "@reduxjs/toolkit"
import appReducer from "./appSlice"
import projectDetailsReducer from "./projectDetailsSlice"
import authReducer from "./authSlice"

export const store = configureStore({
  reducer: {
    authReducer,
    appReducer,
    projectDetailsReducer
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch