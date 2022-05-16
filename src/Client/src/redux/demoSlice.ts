import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "./store"

type DemoStateType = {
    data: string
}

const initialDemoState = {
    data: "demo"
}

export const demoSlice = createSlice({
    name: "demo",
    initialState: initialDemoState,
    reducers: {
        demoLoad(state: DemoStateType, action: PayloadAction<string>) {
            console.log("   new value for demo", action.payload)
            state.data = action.payload
        }
    }
})

export const { demoLoad } = demoSlice.actions
export const selectDemo = (state: RootState) => state.demoReducer
export default demoSlice.reducer
