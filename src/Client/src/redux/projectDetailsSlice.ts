import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { convertToplainObj } from "../common/convertToplainObj"
import { IProjectDetailedInfoVm, ProjectDetailedInfoVm, ProjectDetailedInfoVmHelper } from "../models/ProjectDetails/ProjectDetailedInfoVm"
import { ProjectTaskUnitEstimationVm } from "../models/ProjectDetails/ProjectTaskUnitEstimationVm"
import { IProjectTaskVm, ProjectTaskVm } from "../models/ProjectDetails/ProjectTaskVm"
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

        addTask(state: ProjectDetailsStoreStateType)
        {
            const testTask = new ProjectTaskVm()
            testTask.description = "Монтажные и пусконаладочные работы схемы управления разъединителями ОРУ-110 кВ"
            testTask.start = new Date(2022, 3, 5, 0, 0, 0, 0).getTime()
            testTask.end = new Date(2022, 4, 8, 0, 0, 0, 0).getTime()
          
            const testEstimation1 = new ProjectTaskUnitEstimationVm()
            testEstimation1.id = "asdfasdfsdf"
            testEstimation1.unitName = "Отдел программирования РСУ"
            testEstimation1.estimations = [
              { userPositionId: '1', userPositionIdent: 'И1', hours: 80 },
              { userPositionId: '2', userPositionIdent: 'И2', hours: 240 },
              { userPositionId: '3', userPositionIdent: 'И3', hours: 360 },
            ]
          
            const testEstimation2 = new ProjectTaskUnitEstimationVm()
            testEstimation2.id = "dfgsdfg"
            testEstimation2.unitName = "Отдел программирования СУПП"
            testEstimation2.estimations = [
              { userPositionId: '4', userPositionIdent: 'ГС', hours: 180 },
            ]
          
            const testEstimation3 = new ProjectTaskUnitEstimationVm()
            testEstimation3.id = "iuthoi3hti2hpi"
            testEstimation3.unitName = "Отдел программирования с очень длинным именем"
            testEstimation3.estimations = [
              { userPositionId: '5', userPositionIdent: 'DB', hours: 40 },
            ]
          
            testTask.unitEstimations = [testEstimation1, testEstimation2, testEstimation3]

            state.project.tasks = [convertToplainObj(testTask), ...state.project.tasks]
            ProjectDetailedInfoVmHelper.init(state.project)
        }
    }
})

export const { ganttZoomIn, ganttZoomOut, toggleShowDetails, updateProjectDetailsInfo, addTask } = projectDetailsSlice.actions
export const selectDemo = (state: RootState) => state.projectDetailsReducer
export default projectDetailsSlice.reducer
