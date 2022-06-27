import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "./store";

export type DepartmentPlanState = {
    startDate: number,
    endDate: number,
    hideProjectsWithNoEstimation: boolean,
    hiddenRows: number[],
    showStatistics: boolean,
    collapsedRows: number[]
};

const initialState: DepartmentPlanState = {
    startDate: new Date(new Date().getFullYear(), 0, 1).getTime(),
    endDate: new Date(new Date().getFullYear(), 11, 31).getTime(),
    hideProjectsWithNoEstimation: true,
    hiddenRows: [],
    showStatistics: false,
    collapsedRows: []
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

        setHideProjectsWithNoEstimation(state: DepartmentPlanState, action: PayloadAction<boolean>) {
            state.hideProjectsWithNoEstimation = action.payload
        },

        setHiddenRows(state: DepartmentPlanState, action: PayloadAction<number[]>) {
            state.hiddenRows = action.payload
        },

        toggleShowStatistics(state: DepartmentPlanState) {
            state.showStatistics = !state.showStatistics
        },

        setCollapsedRows(state: DepartmentPlanState, action: PayloadAction<number[]>) {
            state.collapsedRows = action.payload
        },

    }
});

export const { setStartDate, setEndDate, setHideProjectsWithNoEstimation, setHiddenRows, setCollapsedRows, toggleShowStatistics } = departmentPlanSlice.actions;
export const departmentPlan = (state: RootState) => state.appReducer;
export default departmentPlanSlice.reducer
