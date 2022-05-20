import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IProjectDetailedInfoVm } from "../models/ProjectDetails/ProjectDetailedInfoVm"
import { RootState } from "./store"

type ProjectDetailsStoreStateType = {
    ganttChartZoomLevel: number
    showDetails: boolean
    project: IProjectDetailedInfoVm
}

const initialDemoState = {
    ganttChartZoomLevel: 0.3,
    showDetails: false,
    project: {
        id: 0,
        name: '',
        shortName: '',
        company: '',
        isOpened: false,
        isExternal: false,
        projectManager: '',
        chiefEngineer: '',
        start: 0,
        end: 0,
        closeDate: 0, 
        customer: '',
        contract: '',
        tasks: [],
    
        // calculated fields
        totalHours: 0,
        taskMaxDate: 0,
        taskMinDate: 0    
    }
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

        updateProjectDetailsInfo(state: ProjectDetailsStoreStateType, action: PayloadAction<IProjectDetailedInfoVm>) {
            state.project = action.payload
        }
    }
})

export const { ganttZoomIn, ganttZoomOut, toggleShowDetails, updateProjectDetailsInfo } = projectDetailsSlice.actions
export const selectDemo = (state: RootState) => state.projectDetailsReducer
export default projectDetailsSlice.reducer
