import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "./store";

export const LOADING_SCREEN_ID = "__loadingScreen"

export type AppState = {
    requestsInProgress: number
};

export const appSlice = createSlice({
    name: "app",
    initialState: { requestsInProgress: 0 },
    reducers: {
        onRequestStarted(state: AppState) {
            state.requestsInProgress += 1

            if (state.requestsInProgress === 1) {
                setLoadingScreenVisibility(true)
            }
        },

        onRequestCompleted(state: AppState) {
            state.requestsInProgress -= 1

            if (state.requestsInProgress === 0) {
                setLoadingScreenVisibility(false)
            }
        }

    }
});

const setLoadingScreenVisibility = (isVisible: boolean) => {
    // loading screen should be shown/hidden directly in order to prevent unnecessary re-renders of the root component and its children
    const el = document.getElementById(LOADING_SCREEN_ID) as HTMLDivElement
    el?.style.setProperty('display', isVisible ? 'flex' : 'none')
}

export const { onRequestStarted, onRequestCompleted } = appSlice.actions;
export const selectApp = (state: RootState) => state.appReducer;
export default appSlice.reducer
