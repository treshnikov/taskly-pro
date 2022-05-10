import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "./store";

export type AuthState = {
    isAuthenticated: boolean
    jwt: string
};

export type JWT = string

const storageName = 'taskly-user-data'

const initAuthState = () : AuthState => {

    let res = {
        isAuthenticated: false,
        jwt: ""
    }

    const storage = localStorage.getItem(storageName)
    if (!storage) {
        res.isAuthenticated = false
        return res
    }

    const data = JSON.parse(storage)
    if (!data || !data.jwt) {
        res.isAuthenticated = false
        return res
    }

    // todo verify token
    res.jwt = data.jwt
    res.isAuthenticated = true

    return res
}

export const authSlice = createSlice({
    name: "auth",
    initialState: initAuthState(),
    reducers: {
        onSignin(state: AuthState, action: PayloadAction<JWT>) {
            //console.log("sign in", action.payload)
          
            state.isAuthenticated = true
            state.jwt = action.payload

            localStorage.setItem(storageName, JSON.stringify({ jwt: action.payload }))
        },

        onSignout(state: AuthState) {
            //console.log("sign out")
            state.isAuthenticated = false
            state.jwt = ""
            localStorage.removeItem(storageName)
        }
    }
});

export const { onSignin, onSignout } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;
