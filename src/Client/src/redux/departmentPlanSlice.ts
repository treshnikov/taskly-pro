import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "./store";

export type DepartmentPlanState = {
    startDate: number,
    endDate: number,
    hideProjectsWithNoEstimation: boolean,
    hiddenRows: number[],
    showStatistics: boolean
};

const initialState: DepartmentPlanState = {
    startDate: new Date(new Date().getFullYear(), 0, 1).getTime(),
    endDate: new Date(new Date().getFullYear(), 11, 31).getTime(),
    hideProjectsWithNoEstimation: true,
    hiddenRows: [],
    showStatistics: false
}

export const departmentPlanSlice = createSlice({
    name: "departmentPlanState",
    initialState: initialState,
    reducers: {
        setStartDate(state: DepartmentPlanState, action: PayloadAction<Date>) {
            state.startDate = action.payload.getTime()
        },

        setEndDate(state: DepartmentPlanState, action: PayloadAction<Date>) {
            state.endDate = action.payload.getTime()
        },

        setHideProjectsWithNoEstimation(state: DepartmentPlanState, action: PayloadAction<boolean>) {
            state.hideProjectsWithNoEstimation = action.payload
        },

        setHiddenRows(state: DepartmentPlanState, action: PayloadAction<number[]>) {
            state.hiddenRows = action.payload
        },
        toggleShowStatistics(state: DepartmentPlanState) {
            state.showStatistics = !state.showStatistics
        }
    }
});

export const { setStartDate, setEndDate, setHideProjectsWithNoEstimation, setHiddenRows, toggleShowStatistics } = departmentPlanSlice.actions;
export const departmentPlan = (state: RootState) => state.appReducer;
export default departmentPlanSlice.reducer
