import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "./store";

export type AppState = {
    showLoadingScreen: boolean
};

export const appSlice = createSlice({
    name: "app",
    initialState: {showLoadingScreen : false},
    reducers: {
        showLoadingScreen(state: AppState)
        {
            state.showLoadingScreen = true
        },

        hideLoadingScreen(state: AppState)
        {
            state.showLoadingScreen = false
        }

    }
});

export const { showLoadingScreen, hideLoadingScreen } = appSlice.actions;
export const selectApp = (state: RootState) => state.appReducer;
export default appSlice.reducer
