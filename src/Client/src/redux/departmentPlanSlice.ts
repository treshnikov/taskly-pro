import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "./store";

export type DepartmentPlanState = {
    startDate: number,
    endDate: number,
    hideProjectsWithNoEstimation: boolean,
    hiddenRows: number[],
    collapsedRows: number[]
    showStatistics: boolean,
    showUserHolidays: boolean,
    showUserHolidaysUserName: string
};

const initialState: DepartmentPlanState = {
    startDate: new Date(new Date().getFullYear(), 0, 1).getTime(),
    endDate: new Date(new Date().getFullYear(), 11, 31).getTime(),
    hideProjectsWithNoEstimation: true,
    hiddenRows: [],
    collapsedRows: [],
    showStatistics: false,
    showUserHolidays: false,
    showUserHolidaysUserName: ''
}

export const departmentPlanSlice = createSlice({
    name: "departmentPlanState",
    initialState: initialState,
    reducers: {
        setStartDate(state: DepartmentPlanState, action: PayloadAction<number>) {
            state.startDate = action.payload
        },

        setEndDate(state: DepartmentPlanState, action: PayloadAction<number>) {
            state.endDate = action.payload
        },

        setStartAndEndDates(state: DepartmentPlanState, action: PayloadAction<{ startDate: number, endDate: number }>) {
            state.startDate = action.payload.startDate
            state.endDate = action.payload.endDate
        },

        setHideProjectsWithNoEstimation(state: DepartmentPlanState, action: PayloadAction<boolean>) {
            state.hideProjectsWithNoEstimation = action.payload
        },

        setHiddenRows(state: DepartmentPlanState, action: PayloadAction<number[]>) {
            state.hiddenRows = action.payload
        },

        toggleShowStatistics(state: DepartmentPlanState) {
            state.showStatistics = !state.showStatistics
        },

        toggleShowUserHolidays(state: DepartmentPlanState, action: PayloadAction<string>) {
            state.showUserHolidays = !state.showUserHolidays
            state.showUserHolidaysUserName = action.payload
        },

        setCollapsedRows(state: DepartmentPlanState, action: PayloadAction<number[]>) {
            state.collapsedRows = action.payload
        }
    }
});

export const { setStartDate, setEndDate, setStartAndEndDates, setHideProjectsWithNoEstimation, setHiddenRows, toggleShowStatistics, 
    toggleShowUserHolidays, setCollapsedRows } = departmentPlanSlice.actions;
export const departmentPlan = (state: RootState) => state.appReducer;
export default departmentPlanSlice.reducer
