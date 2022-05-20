import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { CellChange } from "handsontable/common"
import { convertToplainObj } from "../common/convertToplainObj"
import { strToDate } from "../common/dateFormatter"
import { IProjectDetailedInfoVm, ProjectDetailedInfoVm, ProjectDetailedInfoVmHelper } from "../models/ProjectDetails/ProjectDetailedInfoVm"
import { ProjectTaskUnitEstimationVm } from "../models/ProjectDetails/ProjectTaskUnitEstimationVm"
import { ProjectTaskVm } from "../models/ProjectDetails/ProjectTaskVm"
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
        },

        addTask(state: ProjectDetailsStoreStateType) {
            const testTask = new ProjectTaskVm()
            testTask.description = "..."
            testTask.start = state.project.start
            testTask.end = state.project.end
            testTask.unitEstimations = []

            state.project.tasks = [convertToplainObj(testTask), ...state.project.tasks]
            ProjectDetailedInfoVmHelper.init(state.project)
        },

        onChangeTaskAttribute(state: ProjectDetailsStoreStateType, action: PayloadAction<CellChange[]>) {
            action.payload.forEach(ch => {
                const taskIdx = ch[0]
                const taskAttribute = ch[1]
                const newValue = ch[3]
                //console.log({taskIdx, taskAttribute, newValue})
                switch (taskAttribute) {
                    case "description":
                        state.project.tasks[taskIdx].description = newValue
                        break;
                    case "comment":
                        state.project.tasks[taskIdx].comment = newValue
                        break;
                    case "startAsStr":
                        state.project.tasks[taskIdx].start = strToDate(newValue as string).getTime()
                        break;
                    case "endAsStr":
                        state.project.tasks[taskIdx].end = strToDate(newValue as string).getTime()
                        break;
                    default:
                        console.warn("Unknown property to change", taskAttribute)
                        return
                }

                ProjectDetailedInfoVmHelper.init(state.project)
            });
        }
    }
})

export const { ganttZoomIn, ganttZoomOut, toggleShowDetails, updateProjectDetailsInfo, addTask, onChangeTaskAttribute } = projectDetailsSlice.actions
export const selectDemo = (state: RootState) => state.projectDetailsReducer
export default projectDetailsSlice.reducer
