import { configureStore } from "@reduxjs/toolkit"
import appReducer from "./appSlice"
import projectDetailsReducer from "./projectDetailsSlice"
import authReducer from "./authSlice"
import departmentPlanReducer from "./departmentPlanSlice"

export const store = configureStore({
  reducer: {
    authReducer,
    appReducer,
    projectDetailsReducer,
    departmentPlanReducer
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch