import { createSlice, freeze, PayloadAction } from "@reduxjs/toolkit"
import { DepartmentUserPlan, DepartmentPlanFlatRecordVmHelper, DepartmentProjectPlan, } from "../models/DepartmentPlan/DepartmentPlanClasses";
import { RootState } from "./store";

export type DepartmentPlanState = {
    startDate: number,
    endDate: number,
    hideProjectsWithNoEstimation: boolean,
    hiddenRows: number[]
};

const initialState: DepartmentPlanState = {
    startDate: new Date(new Date().getFullYear(), 0, 1).getTime(),
    endDate: new Date(new Date().getFullYear(), 11, 31).getTime(),
    hideProjectsWithNoEstimation: true,
    hiddenRows: []
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
    }
});

export const { setStartDate, setEndDate, setHideProjectsWithNoEstimation, setHiddenRows } = departmentPlanSlice.actions;
export const departmentPlan = (state: RootState) => state.appReducer;
export default departmentPlanSlice.reducer
