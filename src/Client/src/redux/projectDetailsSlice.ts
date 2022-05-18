import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "./store"

type projectDetailsStoreStateType = {
    ganttChartZoomLevel: number
}

const initialDemoState = {
    ganttChartZoomLevel: 0.3
}

export const projectDetailsSlice = createSlice({
    name: "projectDetailsSlice",
    initialState: initialDemoState,
    reducers: {
        ganttZoomIn(state: projectDetailsStoreStateType) {
            state.ganttChartZoomLevel = state.ganttChartZoomLevel * 1.2
        },
        
        ganttZoomOut(state: projectDetailsStoreStateType) {
            state.ganttChartZoomLevel = state.ganttChartZoomLevel / 1.2
        }
    }
})

export const { ganttZoomIn, ganttZoomOut } = projectDetailsSlice.actions
export const selectDemo = (state: RootState) => state.projectDetailsReducer
export default projectDetailsSlice.reducer
