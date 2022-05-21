import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "./store";

export type AppState = {
    requestsInProgress: number
};

export const appSlice = createSlice({
    name: "app",
    initialState: {requestsInProgress : 0},
    reducers: {
        onRequestStarted(state: AppState)
        {
            state.requestsInProgress += 1
        },

        onRequestCompleted(state: AppState)
        {
            state.requestsInProgress -= 1
        }

    }
});

export const { onRequestStarted, onRequestCompleted } = appSlice.actions;
export const selectApp = (state: RootState) => state.appReducer;
export default appSlice.reducer
