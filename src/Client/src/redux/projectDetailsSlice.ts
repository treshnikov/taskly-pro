import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "./store"

type ProjectDetailsStoreStateType = {
    ganttChartZoomLevel: number
    showDetails: boolean
    projectShortName: string
}

const initialDemoState = {
    ganttChartZoomLevel: 0.3,
    showDetails: false,
    projectShortName: ''
}

export const projectDetailsSlice = createSlice({
    name: "projectDetailsSlice",
    initialState: initialDemoState,
    reducers: {
        ganttZoomIn(state: ProjectDetailsStoreStateType) {
            state.ganttChartZoomLevel = state.ganttChartZoomLevel * 1.2
        },

        ganttZoomOut(state: ProjectDetailsStoreStateType) {
            state.ganttChartZoomLevel = state.ganttChartZoomLevel / 1.2
        },

        toggleShowDetails(state: ProjectDetailsStoreStateType) {
            state.showDetails = !state.showDetails
        },

        updateProjectData(state: ProjectDetailsStoreStateType, action: PayloadAction<string>) {
            state.projectShortName = action.payload
        }
    }
})

export const { ganttZoomIn, ganttZoomOut, toggleShowDetails, updateProjectData } = projectDetailsSlice.actions
export const selectDemo = (state: RootState) => state.projectDetailsReducer
export default projectDetailsSlice.reducer
