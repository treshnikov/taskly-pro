import { createSlice, freeze, PayloadAction } from "@reduxjs/toolkit"
import { DepartmentUserPlan, DepartmentPlanFlatRecordVmHelper, DepartmentProjectPlan, } from "../models/DepartmentPlan/DepartmentPlanClasses";
import { RootState } from "./store";

export type DepartmentPlanState = {
    plan: DepartmentUserPlan[]
};

const initialState: DepartmentPlanState = {
    plan: [{
        id: '',
        userName: '',
        userPosition: '',
        project: '',
        projectId: 0,
        userId: '',
        hours: '',
        __children: [],
    }]
}

export const departmentPlanSlice = createSlice({
    name: "departmentPlanState",
    initialState: initialState,
    reducers: {
        updatePlan(state: DepartmentPlanState, action: PayloadAction<DepartmentUserPlan[]>) {
            state.plan = action.payload
        },

        onPlanChanged(state: DepartmentPlanState, action: PayloadAction<{ projectId: string, weekId: string, hours: string }>) {
            // find and update changed record
            state.plan.forEach(user => {
                user.__children.forEach(project => {
                    if (project.id === action.payload.projectId) {
                        project[action.payload.weekId] = action.payload.hours
                        DepartmentPlanFlatRecordVmHelper.recalcHours(state.plan, user.userId)
                        console.log(project[action.payload.weekId])
                        return
                    }
                })
            })
            
            
            // let record: DepartmentProjectPlan = { id: '', hours: '', project: '', userPosition: '', userName: '', userId: '', projectId: 0 }
            // const found = state.plan.some(u => u.__children.some(p => {
            //     record = p
            //     return p.id === action.payload.projectId
            // }))

            // if (found) {
            //     record[action.payload.weekId] = action.payload.hours
            //     DepartmentPlanFlatRecordVmHelper.recalcHours(state.plan, record.userId)
            // }
        }
    }
});

export const { onPlanChanged, updatePlan } = departmentPlanSlice.actions;
export const departmentPlan = (state: RootState) => state.appReducer;
export default departmentPlanSlice.reducer
