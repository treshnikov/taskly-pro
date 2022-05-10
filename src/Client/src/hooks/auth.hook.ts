import { toast } from 'react-toastify'
import { useSelector, useDispatch, TypedUseSelectorHook } from "react-redux"
import { onSignin, onSignout, selectAuth } from "../redux/authSlice"
import { RootState } from '../redux/store'
import { useCallback } from 'react'

export const useAuth = () => {
    const dispatch = useDispatch();
    const useAuthSelector: TypedUseSelectorHook<RootState> = useSelector;
    const auth = useAuthSelector(selectAuth)
    
    const login = async (data: FormData) => {
        const json = await request("/api/v1/auth/token",
            {
                method: 'post',
                body: data,
            });

        dispatch(onSignin(json.jwt))
    }

    const logout = () => {
        dispatch(onSignout())
    }

    const request = useCallback(async (input: RequestInfo, init?: RequestInit) => {
        if (!init) {
            init = {}
        }
        init.headers = { Authorization: `Bearer ${auth.jwt}` }

        let response
        try {
            response = await fetch(input, init)
        } catch (ex) {
            const err = ex as Error;
            if (err) {
                toast.error(err.message);
            }
            throw (ex)
        }

        if (response.status === 401 || response.status === 403) {
            // It's supposed that the client shouldn't send requests that bring it to the 401|403 states.
            // Nevertheless, if the client got this it might mean that the token has expired or the client requests a resource that requires higher privileges which means the login procedure must be repeated  
            dispatch(onSignout())
        }

        const json = await response.json()

        if (response.ok) {
            return json;
        }

        // handle error message from server's custom exceptions
        let errorText = response.statusText
        if (json.hasOwnProperty("Error")) {
            errorText += ": " + json.Error
        }
        toast.error(errorText);

        throw new Error(errorText)
    }, [auth, dispatch])

    return { login, logout, request }
}