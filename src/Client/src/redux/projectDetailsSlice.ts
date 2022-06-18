import { createSlice, current, PayloadAction } from "@reduxjs/toolkit"
import { CellChange } from "handsontable/common"
import { strToDate } from "../common/dateFormatter"
import { IProjectDetailedInfoVm, ProjectDetailedInfoVmHelper } from "../models/ProjectDetails/ProjectDetailedInfoVm"
import { IProjectTaskDepartmentEstimationVm } from "../models/ProjectDetails/ProjectTaskDepartmentEstimationVm"
import { IProjectTaskVm, ProjectTaskVm } from "../models/ProjectDetails/ProjectTaskVm"
import { RootState } from "./store"

type ProjectDetailsStoreStateType = {
    ganttChartZoomLevel: number
    compactMode: boolean
    showStatistics: boolean
    showDepartmentsPlan: boolean
    selectedRowIdx: number
    lastSelectedRowIdx: number
    hiddenColumns: number[]
    project: IProjectDetailedInfoVm
}

const initState = {
    ganttChartZoomLevel: 0.3,
    compactMode: false,
    showStatistics: false,
    showDepartmentsPlan: false,
    selectedRowIdx: -1,
    lastSelectedRowIdx: -1,
    hiddenColumns: [0],
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
        tasks: [{
            id: '',
            start: 0,
            end: 0,
            description: '',
            comment: '',
            departmentEstimations: [],

            // calculated
            startAsStr: '',
            endAsStr: '',
            totalHours: 0
        }],

        // calculated fields
        totalHours: 0,
        taskMaxDate: 0,
        taskMinDate: 0
    }
}

export const projectDetailsSlice = createSlice({
    name: "projectDetailsSlice",
    initialState: initState,
    reducers: {
        zoomInGanttChart(state: ProjectDetailsStoreStateType) {
            state.ganttChartZoomLevel = state.ganttChartZoomLevel * 1.2
        },

        zoomOutGanttChart(state: ProjectDetailsStoreStateType) {
            state.ganttChartZoomLevel = state.ganttChartZoomLevel / 1.2
        },

        toggleShowStatistics(state: ProjectDetailsStoreStateType) {
            state.showStatistics = !state.showStatistics
        },

        toggleShowDepartmentsPlan(state: ProjectDetailsStoreStateType) {
            state.showDepartmentsPlan = !state.showDepartmentsPlan
        },

        toggleCompactMode(state: ProjectDetailsStoreStateType) {
            state.compactMode = !state.compactMode
            if (state.compactMode) {
                // hide id, estimations, and gantt chart
                state.hiddenColumns.splice(0, state.hiddenColumns.length, ...[0, 4, 7])
            }
            else {
                // hide id column only
                state.hiddenColumns.splice(0, state.hiddenColumns.length, ...[0])
            }
        },

        updateProjectDetailsInfo(state: ProjectDetailsStoreStateType, action: PayloadAction<IProjectDetailedInfoVm>) {
            state.project = action.payload
        },

        addTask(state: ProjectDetailsStoreStateType, action: PayloadAction<{task : ProjectTaskVm}>) {
            state.project.tasks = [...state.project.tasks, { ...action.payload.task }]
            ProjectDetailedInfoVmHelper.init(state.project)
        },

        onTaskAttributeChanged(state: ProjectDetailsStoreStateType, action: PayloadAction<CellChange[]>) {
            action.payload.forEach(ch => {
                const taskIdx = ch[0]
                const taskAttribute = ch[1]
                const newValue = ch[3]
                switch (taskAttribute) {
                    case "description":
                        state.project.tasks[taskIdx].description = newValue
                        break;
                    case "comment":
                        state.project.tasks[taskIdx].comment = newValue
                        break;
                    case "startAsStr":
                        const dtStart = strToDate(newValue as string)
                        if (!isNaN(dtStart.getTime()) && dtStart.getTime() <= state.project.end) {
                            state.project.tasks[taskIdx].start = dtStart.getTime()
                        }
                        break;
                    case "endAsStr":
                        const dtEnd = strToDate(newValue as string)
                        if (!isNaN(dtEnd.getTime()) && dtEnd.getTime() >= state.project.start) {
                            state.project.tasks[taskIdx].end = dtEnd.getTime()
                        }
                        break;
                    default:
                        console.warn("Unknown property to change", taskAttribute)
                        return
                }

                ProjectDetailedInfoVmHelper.init(state.project)
            });
        },

        onTasksMoved(state: ProjectDetailsStoreStateType, action: PayloadAction<{ movedRows: number[], finalIndex: number }>) {
            const movedRowIdxs = action.payload.movedRows
            const finalIndex = action.payload.finalIndex
            if (!movedRowIdxs || movedRowIdxs.length === 0) {
                return
            }

            if (movedRowIdxs[0] === finalIndex) {
                return
            }

            const tasks = [...current(state).project.tasks]
            const tasksToMove = tasks.splice(movedRowIdxs[0], movedRowIdxs.length)
            tasks.splice(finalIndex, 0, ...tasksToMove)
            state.project.tasks.splice(0, state.project.tasks.length, ...tasks)
        },

        onRowSelected(state: ProjectDetailsStoreStateType, action: PayloadAction<number>) {
            if (action.payload >= 0){
                state.lastSelectedRowIdx = action.payload
            }
            
            state.selectedRowIdx = action.payload
        },

        removeTask(state: ProjectDetailsStoreStateType) {
            if (state.selectedRowIdx < 0) {
                return
            }

            state.project.tasks = state.project.tasks.filter((i, idx) => idx !== state.selectedRowIdx)
        },

        orderTasks(state: ProjectDetailsStoreStateType) {
            state.project.tasks = state.project.tasks.sort((a, b) => a.start > b.start ? 1 : -1)
        },

        changeEstimation(state: ProjectDetailsStoreStateType, action: PayloadAction<{ taskId: string, departmentId: string, userPositionId: string, hours: number }>) {
            const record = state.project.tasks
                ?.find(t => t.id === action.payload.taskId)
                ?.departmentEstimations.find(e => e.departmentId === action.payload.departmentId)
                ?.estimations.find(e => e.userPositionId === action.payload.userPositionId)

            if (record) {
                record.hours = action.payload.hours
            }

            ProjectDetailedInfoVmHelper.init(state.project)
        },

        changeTask(state: ProjectDetailsStoreStateType, action: PayloadAction<{ task: IProjectTaskVm }>) {
            const taskIdx = state.project.tasks.findIndex(t => t.id === action.payload.task.id)
            if (taskIdx === -1) {
                return
            }

            state.project.tasks[taskIdx] = action.payload.task

            ProjectDetailedInfoVmHelper.init(state.project)
        }

    }
})

export const { zoomInGanttChart, zoomOutGanttChart, toggleCompactMode,
    updateProjectDetailsInfo, addTask, onTaskAttributeChanged, onTasksMoved, toggleShowStatistics,
    onRowSelected, removeTask, orderTasks, toggleShowDepartmentsPlan, changeEstimation, changeTask } = projectDetailsSlice.actions
export const selectDemo = (state: RootState) => state.projectDetailsReducer
export default projectDetailsSlice.reducer
