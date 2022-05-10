import { authReducer as authReducer } from "./reducer";
import { configureStore } from "@reduxjs/toolkit"

export const store = configureStore({ reducer: authReducer });
