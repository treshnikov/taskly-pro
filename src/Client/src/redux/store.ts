import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import projectDetailsReducer from "./projectDetailsSlice";
import demoReducer from "./demoSlice"

export const store = configureStore({
  reducer:
  {
    authReducer,
    projectDetailsReducer,
    demoReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  })
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch